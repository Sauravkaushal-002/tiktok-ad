"use client";

import React from "react"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, Music, Upload, VolumeX } from "lucide-react";

type Objective = "traffic" | "conversions" | "app_installs";
type MusicOption = "no_music" | "from_library" | "upload";

//NOTE :WE can also use react hook form here
interface FormData {
  campaignName: string;
  objective: Objective | "";
  adText: string;
  callToAction: string;
  musicOption: MusicOption;
  musicId: string;
}

interface FormErrors {
  campaignName?: string;
  objective?: string;
  adText?: string;
  callToAction?: string;
  musicOption?: string;
}

const CALL_TO_ACTION_OPTIONS = [
  { value: "learn_more", label: "Learn More" },
  { value: "shop_now", label: "Shop Now" },
  { value: "sign_up", label: "Sign Up" },
  { value: "download", label: "Download" },
  { value: "contact_us", label: "Contact Us" },
  { value: "get_quote", label: "Get Quote" },
  { value: "subscribe", label: "Subscribe" },
  { value: "book_now", label: "Book Now" },
];

const MUSIC_LIBRARY = [
  { id: "music_1", name: "Upbeat Pop - Summer Vibes" },
  { id: "music_2", name: "Corporate Motivation" },
  { id: "music_3", name: "Chill Lo-Fi Beats" },
  { id: "music_4", name: "Electronic Dance" },
  { id: "music_5", name: "Acoustic Guitar" },
];

export function AdCreationForm() {
  const [formData, setFormData] = useState<FormData>({
    campaignName: "",
    objective: "",
    adText: "",
    callToAction: "",
    musicOption: "no_music",
    musicId: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Reset music option when objective changes to conversions
  useEffect(() => {
    if (formData.objective === "conversions" && formData.musicOption !== "no_music") {
      setFormData((prev) => ({
        ...prev,
        musicOption: "no_music",
        musicId: "",
      }));
    }
  }, [formData.objective, formData.musicOption]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = "Campaign name is required";
    } else if (formData.campaignName.length > 100) {
      newErrors.campaignName = "Campaign name must be 100 characters or less";
    }

    if (!formData.objective) {
      newErrors.objective = "Please select an advertising objective";
    }

    if (!formData.adText.trim()) {
      newErrors.adText = "Ad text is required";
    } else if (formData.adText.length > 500) {
      newErrors.adText = "Ad text must be 500 characters or less";
    }

    if (!formData.callToAction) {
      newErrors.callToAction = "Please select a call-to-action";
    }

    if (formData.musicOption === "from_library" && !formData.musicId) {
      newErrors.musicOption = "Please select a music track from the library";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setSubmitSuccess("Dummy Campaign created successfully");
      setIsSubmitting(false);
    }, 3000);

  };

  const isMusicDisabled = formData.objective === "conversions";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {submitSuccess && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{submitSuccess}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input
          id="campaignName"
          placeholder="Enter campaign name"
          value={formData.campaignName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, campaignName: e.target.value }))
          }
          className={errors.campaignName ? "border-destructive" : ""}
        />
        {errors.campaignName && (
          <p className="text-sm text-destructive">{errors.campaignName}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formData.campaignName.length}/100 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective">Advertising Objective</Label>
        <Select
          value={formData.objective}
          onValueChange={(value: Objective) =>
            setFormData((prev) => ({ ...prev, objective: value }))
          }
        >
          <SelectTrigger
            id="objective"
            className={errors.objective ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select an objective" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="traffic">Traffic</SelectItem>
            <SelectItem value="conversions">Conversions</SelectItem>
            <SelectItem value="app_installs">App Installs</SelectItem>
          </SelectContent>
        </Select>
        {errors.objective && (
          <p className="text-sm text-destructive">{errors.objective}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="adText">Ad Text</Label>
        <Textarea
          id="adText"
          placeholder="Write your ad copy here..."
          value={formData.adText}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, adText: e.target.value }))
          }
          className={errors.adText ? "border-destructive" : ""}
          rows={4}
        />
        {errors.adText && (
          <p className="text-sm text-destructive">{errors.adText}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formData.adText.length}/500 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="callToAction">Call to Action</Label>
        <Select
          value={formData.callToAction}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, callToAction: value }))
          }
        >
          <SelectTrigger
            id="callToAction"
            className={errors.callToAction ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select a call-to-action" />
          </SelectTrigger>
          <SelectContent>
            {CALL_TO_ACTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.callToAction && (
          <p className="text-sm text-destructive">{errors.callToAction}</p>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Music Options</CardTitle>
          {isMusicDisabled && (
            <p className="text-sm text-muted-foreground">
              Music is not available for Conversion campaigns
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={formData.musicOption}
            onValueChange={(value: MusicOption) =>
              setFormData((prev) => ({
                ...prev,
                musicOption: value,
                musicId: value !== "from_library" ? "" : prev.musicId,
              }))
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="no_music" id="no_music" />
              <Label
                htmlFor="no_music"
                className="flex cursor-pointer items-center gap-2 font-normal"
              >
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                No Music
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="from_library"
                id="from_library"
                disabled={isMusicDisabled}
              />
              <Label
                htmlFor="from_library"
                className={`flex cursor-pointer items-center gap-2 font-normal ${
                  isMusicDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <Music className="h-4 w-4 text-muted-foreground" />
                Select from TikTok Library
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="upload"
                id="upload"
                disabled={isMusicDisabled}
              />
              <Label
                htmlFor="upload"
                className={`flex cursor-pointer items-center gap-2 font-normal ${
                  isMusicDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                Upload Custom Music
              </Label>
            </div>
          </RadioGroup>

          {formData.musicOption === "from_library" && !isMusicDisabled && (
            <div className="ml-7 space-y-2">
              <Label htmlFor="musicSelect">Select a track</Label>
              <Select
                value={formData.musicId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, musicId: value }))
                }
              >
                <SelectTrigger
                  id="musicSelect"
                  className={errors.musicOption ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Choose a music track" />
                </SelectTrigger>
                <SelectContent>
                  {MUSIC_LIBRARY.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.musicOption === "upload" && !isMusicDisabled && (
            <div className="ml-7">
              <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3 or WAV (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {errors.musicOption && (
            <p className="text-sm text-destructive">{errors.musicOption}</p>
          )}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Campaign...
          </>
        ) : (
          "Create Campaign"
        )}
      </Button>
    </form>
  );
}
