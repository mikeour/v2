type LetterboxdAuthType = {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
};

export function getLetterboxdAuth(): LetterboxdAuthType {
  if (!process.env.LETTERBOXD_API_KEY) {
    throw new Error("Missing LETTERBOXD_API_KEY");
  }
  if (!process.env.LETTERBOXD_API_SECRET) {
    throw new Error("Missing LETTERBOXD_API_SECRET");
  }
  if (!process.env.LETTERBOXD_ACCESS_TOKEN) {
    throw new Error("Missing LETTERBOXD_ACCESS_TOKEN");
  }

  return {
    apiKey: process.env.LETTERBOXD_API_KEY,
    apiSecret: process.env.LETTERBOXD_API_SECRET,
    accessToken: process.env.LETTERBOXD_ACCESS_TOKEN,
  };
}

type SpotifyAuthType = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export function getSpotifyAuth(): SpotifyAuthType {
  if (!process.env.SPOTIFY_CLIENT_ID) {
    throw new Error("Missing SPOTIFY_CLIENT_ID");
  }
  if (!process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("Missing SPOTIFY_CLIENT_SECRET");
  }
  if (!process.env.SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Missing SPOTIFY_REFRESH_TOKEN");
  }

  return {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  };
}

type LastFMAuthType = {
  apiKey: string;
  username: string;
};

export function getLastFMAuth(): LastFMAuthType {
  if (!process.env.LASTFM_API_KEY) {
    throw new Error("Missing LASTFM_API_KEY");
  }
  if (!process.env.LASTFM_USERNAME) {
    throw new Error("Missing LASTFM_USERNAME");
  }

  return {
    apiKey: process.env.LASTFM_API_KEY,
    username: process.env.LASTFM_USERNAME,
  };
}
