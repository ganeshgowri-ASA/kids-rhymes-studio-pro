"use client";
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm z-[60] flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      You are offline. Some features may not be available.
    </div>
  );
}
