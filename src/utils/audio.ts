/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio API sound synthesizer and ambient music engine for Block Blast
// 100% self-contained and offline capable with zero external audio assets.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hapticsEnabled: boolean = true;

  // Independent volume controls (0.0 to 1.0)
  private musicVolume: number = 0.45;
  private sfxVolume: number = 0.75;

  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;

  // Ambient music state
  private isMusicPlaying: boolean = false;
  private musicIntervalId: ReturnType<typeof setInterval> | null = null;
  private nextBarTime: number = 0;
  private currentChordIndex: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('blockblast_muted');
      this.isMuted = savedMute === 'true';

      const savedHaptics = localStorage.getItem('blockblast_haptics');
      this.hapticsEnabled = savedHaptics !== 'false';

      const savedMusicVol = localStorage.getItem('blockblast_music_volume');
      if (savedMusicVol !== null) {
        const val = parseFloat(savedMusicVol);
        if (!isNaN(val) && val >= 0 && val <= 1) {
          this.musicVolume = val;
        }
      }

      const savedSfxVol = localStorage.getItem('blockblast_sfx_volume');
      if (savedSfxVol !== null) {
        const val = parseFloat(savedSfxVol);
        if (!isNaN(val) && val >= 0 && val <= 1) {
          this.sfxVolume = val;
        }
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master gain for SFX
        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
        this.sfxGainNode.connect(this.ctx.destination);

        // Master gain for Ambient Music
        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.ctx.currentTime);
        this.musicGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // --- Volume & Settings Controls ---

  public setMusicVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.musicVolume = clamped;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_music_volume', String(clamped));
    }
    if (this.ctx && this.musicGainNode) {
      const targetGain = this.isMuted ? 0 : clamped;
      this.musicGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setSfxVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.sfxVolume = clamped;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_sfx_volume', String(clamped));
    }
    if (this.ctx && this.sfxGainNode) {
      const targetGain = this.isMuted ? 0 : clamped;
      this.sfxGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_muted', String(this.isMuted));
    }
    if (this.ctx) {
      if (this.sfxGainNode) {
        this.sfxGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime, 0.05);
      }
      if (this.musicGainNode) {
        this.musicGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.musicVolume, this.ctx.currentTime, 0.08);
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleHaptics(): boolean {
    this.hapticsEnabled = !this.hapticsEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockblast_haptics', String(this.hapticsEnabled));
    }
    return this.hapticsEnabled;
  }

  public getHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public triggerHaptic(type: 'pickup' | 'place' | 'blast') {
    if (!this.hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      if (type === 'pickup') {
        navigator.vibrate(12);
      } else if (type === 'place') {
        navigator.vibrate(22);
      } else if (type === 'blast') {
        navigator.vibrate([35, 25, 45]);
      }
    } catch {}
  }

  // --- Relaxing Ambient Background Music Loop ---
  // Dreamy chord progression: Cmaj9 -> Am9 -> Fmaj7 -> G6
  // Voiced with warm low-passed oscillators and gentle, tranquil pentatonic raindrops

  public startMusic() {
    this.initContext();
    if (!this.ctx || this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    if (this.musicGainNode) {
      const targetGain = this.isMuted ? 0 : this.musicVolume;
      this.musicGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2);
    }

    this.nextBarTime = this.ctx.currentTime + 0.1;
    this.currentChordIndex = 0;

    // Scheduler tick every 150ms
    this.musicIntervalId = setInterval(() => {
      if (!this.ctx || !this.isMusicPlaying) return;

      const lookahead = 1.0;
      while (this.nextBarTime < this.ctx.currentTime + lookahead) {
        this.scheduleAmbientBar(this.nextBarTime, this.currentChordIndex);
        this.currentChordIndex = (this.currentChordIndex + 1) % 4;
        this.nextBarTime += 4.0; // 4 seconds per ambient chord bar (60 BPM)
      }
    }, 150);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    if (this.ctx && this.musicGainNode) {
      this.musicGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    }
  }

  public pauseMusic() {
    // When game is paused, smoothly duck volume down to 30%
    if (this.ctx && this.musicGainNode && this.isMusicPlaying) {
      const duckedGain = this.isMuted ? 0 : this.musicVolume * 0.35;
      this.musicGainNode.gain.setTargetAtTime(duckedGain, this.ctx.currentTime, 0.2);
    }
  }

  public resumeMusic() {
    if (this.ctx && this.musicGainNode && this.isMusicPlaying) {
      const targetGain = this.isMuted ? 0 : this.musicVolume;
      this.musicGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2);
    } else if (!this.isMusicPlaying) {
      this.startMusic();
    }
  }

  private scheduleAmbientBar(time: number, chordIndex: number) {
    if (!this.ctx || !this.musicGainNode) return;

    // Peaceful 4-chord progression:
    // 0: Cmaj9:  C3 (130.81), G3 (196.00), B3 (246.94), E4 (329.63), G4 (392.00)
    // 1: Am9:    A2 (110.00), E3 (164.81), G3 (196.00), C4 (261.63), E4 (329.63)
    // 2: Fmaj7:  F2 (87.31),  C3 (130.81), A3 (220.00), C4 (261.63), E4 (329.63)
    // 3: Gsus4:  G2 (98.00),  D3 (146.83), G3 (196.00), C4 (261.63), D4 (293.66)
    const chordVoicings = [
      [130.81, 196.00, 246.94, 329.63, 392.00],
      [110.00, 164.81, 196.00, 261.63, 329.63],
      [87.31, 130.81, 220.00, 261.63, 329.63],
      [98.00, 146.83, 196.00, 261.63, 293.66],
    ];

    const currentNotes = chordVoicings[chordIndex];

    // Lowpass filter for smooth ambient warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, time);
    filter.frequency.linearRampToValueAtTime(800, time + 2.0);
    filter.frequency.linearRampToValueAtTime(650, time + 4.0);
    filter.connect(this.musicGainNode);

    // Play soft sustaining chord pad
    currentNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Subtle warm detune on upper voices
      if (idx > 0) {
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, time);
      }

      // Smooth envelope attack and release
      const baseAmp = idx === 0 ? 0.08 : 0.04;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(baseAmp, time + 1.2);
      gain.gain.setValueAtTime(baseAmp, time + 2.8);
      gain.gain.linearRampToValueAtTime(0, time + 4.0);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(time);
      osc.stop(time + 4.05);
    });

    // Schedule 2-3 gentle melodic "raindrop" bells during the 4-second bar
    const bellPitches = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    const bellDelays = [0.8, 2.2, 3.2];

    bellDelays.forEach((delay) => {
      if (!this.ctx) return;
      const bellTime = time + delay;
      const pitch = bellPitches[Math.floor(Math.random() * bellPitches.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, bellTime);

      gain.gain.setValueAtTime(0, bellTime);
      gain.gain.linearRampToValueAtTime(0.045, bellTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, bellTime + 1.6);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(bellTime);
      osc.stop(bellTime + 1.65);
    });
  }

  // --- Sound Effects (Connected to sfxGainNode) ---

  public playPickup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  public playPlace() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;

      // Resonant wood/glass tap
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain1.gain.setValueAtTime(0.24, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc1.connect(gain1);
      gain1.connect(this.sfxGainNode);

      // Higher subtle click
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain2.gain.setValueAtTime(0.14, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc2.connect(gain2);
      gain2.connect(this.sfxGainNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.1);
      osc2.stop(now + 0.05);
    } catch {}
  }

  public playLineClear(linesCleared: number, comboCount: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const baseIdx = Math.min(comboCount * 2, scale.length - 4);
      const notesToPlay = Math.min(linesCleared + 2, 5);

      for (let i = 0; i < notesToPlay; i++) {
        const noteIdx = (baseIdx + i * 2) % scale.length;
        const freq = scale[noteIdx];
        const noteTime = now + i * 0.055;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = comboCount > 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        const volume = Math.min(0.2 + comboCount * 0.03, 0.4);
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(volume, noteTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(noteTime);
        osc.stop(noteTime + 0.38);
      }
    } catch {}
  }

  public playComboStreak(combo: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      const pitches = [523.25, 659.25, 783.99, 1046.50];
      const startPitch = pitches[Math.min(combo - 1, pitches.length - 1)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startPitch, now);
      osc.frequency.exponentialRampToValueAtTime(startPitch * 1.5, now + 0.2);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 415.3, 370, 311.13];

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const noteTime = now + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(noteTime);
        osc.stop(noteTime + 0.32);
      });
    } catch {}
  }

  public playLevelVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const noteTime = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.22, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(noteTime);
        osc.stop(noteTime + 0.42);
      });
    } catch {}
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }
}

export const sounds = new SoundManager();
