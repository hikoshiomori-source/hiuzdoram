export interface Drama {
  id: string;
  title: string;
  titleUz?: string;
  poster: string;
  backdrop?: string;
  year: number;
  rating: number;
  genres: string[];
  country: "South Korea" | "Japan" | "China" | "Thailand";
  episodes: Episode[];
  totalEpisodes: number;
  status: "Ongoing" | "Completed" | "Upcoming";
  synopsis: string;
  cast?: CastMember[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  moverEmbedUrl: string; // Mover.uz embed URL
  thumbnail?: string;
  duration: string;
  aired?: string;
}

export interface CastMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: { name: string; avatar: string };
  text: string;
  likes: number;
  time: string;
  isSpoiler?: boolean;
}

export interface AdminDrama {
  id: string;
  title: string;
  status: "Published" | "Draft" | "Scheduled";
  episodes: number;
  views: string;
  rating: number;
  lastUpdated: string;
}
