function createEnvConfig<T>(loader: () => T): () => T {
  let cached: T | undefined;
  return () => {
    if (cached === undefined) {
      cached = loader();
    }
    return cached;
  };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export const spotify = createEnvConfig(() => ({
  clientId: requireEnv("SPOTIFY_CLIENT_ID"),
  clientSecret: requireEnv("SPOTIFY_CLIENT_SECRET"),
  refreshToken: requireEnv("SPOTIFY_REFRESH_TOKEN"),
}));

export const lastfm = createEnvConfig(() => ({
  apiKey: requireEnv("LASTFM_API_KEY"),
  username: requireEnv("LASTFM_USERNAME"),
}));

export const tmdb = createEnvConfig(() => ({
  apiKey: requireEnv("TMDB_API_KEY"),
}));
