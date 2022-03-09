export interface CardProps {
  id: string;
  imageUrl: string;
  size?: "large" | "medium" | "small";
  shouldScale?: boolean;
}

export interface VideoFields {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface SectionCardProps {
  title: string;
  videos: VideoFields[];
  size: "large" | "medium" | "small";
  shouldWrap?: boolean;
  shouldScale?: boolean;
}

// export interface NavBarProps {
//   username: string;
// }

export interface BannerProps {
  videoId: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}
