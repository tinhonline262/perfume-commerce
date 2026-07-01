export interface SocialLink {
  id: string;
  name: string;
  url: string;
  ariaLabel: string;
}

export const socialLinks: SocialLink[] = [
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com",
    ariaLabel: "Follow us on Facebook",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com",
    ariaLabel: "Follow us on Instagram",
  },
  {
    id: "tiktok",
    name: "TikTok",
    url: "https://www.tiktok.com",
    ariaLabel: "Follow us on TikTok",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com",
    ariaLabel: "Subscribe to our YouTube channel",
  },
];
