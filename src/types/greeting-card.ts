export interface GreetingCardSetting {
  id: string;
  event_title: string;
  event_tagline: string;
  event_description: string;
  event_date: string; // ISO date string e.g. "2026-11-06"
  template_image_path: string;
  is_active: boolean;
  created_at: string;
}

export interface GreetingCardConfigResponse {
  success: boolean;
  data?: GreetingCardSetting;
  error?: string;
  source: "supabase" | "fallback";
}

export interface UserCardData {
  fullName: string;
}

export type DownloadFormat = "png" | "jpg";

