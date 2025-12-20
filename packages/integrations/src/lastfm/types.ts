export type LastFmImage = {
  size: "small" | "medium" | "large" | "extralarge";
  "#text": string;
};

export type LastFmArtist = {
  mbid: string;
  "#text": string;
};

export type LastFmAlbum = {
  mbid: string;
  "#text": string;
};

export type LastFmDate = {
  uts: string;
  "#text": string;
};

export type LastFmNowPlayingAttr = {
  nowplaying: "true";
};

export type LastFmTrackBase = {
  artist: LastFmArtist;
  streamable: string;
  image: LastFmImage[];
  mbid: string;
  album: LastFmAlbum;
  name: string;
  url: string;
};

export type LastFmNowPlayingTrack = LastFmTrackBase & {
  "@attr": LastFmNowPlayingAttr;
  date?: never;
};

export type LastFmRecentTrack = LastFmTrackBase & {
  date: LastFmDate;
  "@attr"?: never;
};

export type LastFmTrack = LastFmNowPlayingTrack | LastFmRecentTrack;

export type LastFmRecentTracksAttr = {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
};

export type LastFmRecentTracksResponse = {
  recenttracks: {
    track: LastFmTrack[];
    "@attr": LastFmRecentTracksAttr;
  };
};
