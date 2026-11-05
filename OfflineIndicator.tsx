/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 border border-amber-500/40 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-xl backdrop-blur-md animate-fade-in pointer-events-none">
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span>Offline Mode · Playing offline with no WiFi needed</span>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 border border-emerald-500/40 px-3.5 py-1 text-xs font-semibold text-emerald-300 shadow-xl backdrop-blur-md animate-fade-in pointer-events-none">
        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        <span>Back Online · Game synced</span>
      </div>
    );
  }

  return null;
};
