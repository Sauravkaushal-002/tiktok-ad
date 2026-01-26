"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TikTokConnectButton } from "@/components/tiktok-connect-button";
import { AdCreationForm } from "@/components/ad-creation-form";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Check connection status on mount
  useEffect(() => {
    async function checkConnectionStatus() {
      try {   
        const response = await fetch("/api/auth/tiktok/status");
        const data = await response.json();
        setIsConnected(data.connected);
      } catch {
        setIsConnected(false);
      } finally {  
        setIsLoading(false);
      }
    }

    checkConnectionStatus();
  }, []);

  //  URL parameters for OAuth callbacks
  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");

    if (connected === "true") {
      setIsConnected(true);
      setNotification({
        type: "success",
        message: "Successfully connected to TikTok!",
      });
      // Clear URL parameters
      window.history.replaceState({}, "", "/");
    }

    if (error) {
      setNotification({
        type: "error",
        message: decodeURIComponent(error),
      });
      // Clear URL parameters
      window.history.replaceState({}, "", "/");
    }

    // Auto-dismiss notification after 5 seconds
    if (connected || error) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleDisconnect = async () => {
    try {
      await fetch("/api/auth/tiktok/disconnect", { method: "POST" });
      setIsConnected(false);
      setNotification({
        type: "success",
        message: "TikTok account disconnected.",
      });
    } catch {
      setNotification({
        type: "error",
        message: "Failed to disconnect. Please try again.",
      });
    }
  };

  return (
    <> 
    <main className="min-h-screen bg-background">

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            TikTok Ads Creative
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage your TikTok advertising campaigns
          </p>
        </div>

        {notification && (
          <Alert
            variant={notification.type === "error" ? "destructive" : "default"}
            className={`mb-6 ${
              notification.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : ""
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">TikTok Account</CardTitle>
                <CardDescription>
                  Connect your TikTok Ads account to create campaigns
                </CardDescription>
              </div>
              {!isLoading && (
                <TikTokConnectButton
                  isConnected={isConnected}
                  onDisconnect={handleDisconnect}
                />
              )}
            </div>
          </CardHeader>
        </Card>

        {isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>
                Fill in the details below to create a new TikTok ad campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdCreationForm />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-muted p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="M9 12h.01" />
                  <path d="M15 12h.01" />
                  <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                  <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Connect to Get Started
              </h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Connect your TikTok Ads account to start creating campaigns
              </p>
              <TikTokConnectButton
                isConnected={false}
                onDisconnect={handleDisconnect}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
    </>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto flex max-w-2xl items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
