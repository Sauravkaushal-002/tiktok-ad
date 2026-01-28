"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TikTokConnectButtonProps {
  isConnected: boolean;
 
}

export function TikTokConnectButton({
  isConnected,
  
}: TikTokConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Redirect to OAuth flow
    window.location.href = "/api/auth/tiktok";
  };



  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-muted-foreground">Connected</span>
        </div>
   
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect TikTok Account"
      )}
    </Button>
  );
}
