export interface TrackData {
  id: number;
  artist: string;
  album: string;
  songUrl: string | null;
  title: string;
  albumImageUrl: string;
  playedAt: string | number;
  isPlaying: boolean;
  duration: string;
}
