import { createHmac } from "node:crypto";
import letterboxd from "letterboxd";
import { v4 as uuidv4 } from "uuid";

import { getFormattedDate, getLetterboxdAuth } from "~/utils";
import type { APIResponse, Film, LetterboxdFilm, Params } from "./types";

export const BASE_URL = "https://api.letterboxd.com/api/v0";

const { accessToken, apiKey, apiSecret } = getLetterboxdAuth();

function buildUrl(url: string, params?: Params) {
  const urlObj = new URL(`${BASE_URL}${url}`);

  if (params) {
    for (const key in params) {
      if (Object.hasOwn(params, key)) {
        urlObj.searchParams.set(key, String(params[key]));
      }
    }
  }

  return urlObj.toString();
}

function buildParams(
  method: string,
  url: string,
  body?: Params | URLSearchParams,
  params: Params = {}
) {
  const fullParams = params;
  fullParams.apikey = apiKey;
  fullParams.nonce = uuidv4();
  fullParams.timestamp = Math.floor(Date.now() / 1000);

  let bodyString = "";
  if (body) {
    bodyString =
      body instanceof URLSearchParams ? body.toString() : JSON.stringify(body);
  }

  const sigBase = [
    method.toUpperCase(),
    buildUrl(url, fullParams),
    bodyString,
  ].join("\u0000");

  fullParams.signature = createHmac("sha256", apiSecret)
    .update(sigBase)
    .digest("hex")
    .toLowerCase();

  return fullParams;
}

export function request<T extends APIResponse>(opts: {
  method: "get" | "post" | "patch" | "delete";
  path: string;
  params?: Params;
  body?: Params;
  headers?: Record<string, string>;
}) {
  let formBody: URLSearchParams | undefined;

  if (
    opts.headers &&
    opts.body &&
    opts.headers["Content-Type"] === "application/x-www-form-urlencoded"
  ) {
    formBody = new URLSearchParams();

    for (const key of Object.keys(opts.body)) {
      formBody.append(key, String(opts.body[key]));
    }
  }

  const params = buildParams(
    opts.method,
    opts.path,
    formBody || opts.body,
    opts.params
  );
  const url = buildUrl(opts.path, params);

  return fetch(url, {
    method: opts.method,
    body: formBody || (opts.body ? JSON.stringify(opts.body) : undefined),
    headers: {
      ...opts.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  }).then(async (res) => {
    // This mess allows us to easily handle `res.json()`, and falling back to `res.text()` if our
    // JSON response isn't actually JSON, without having to clone the response.
    const buffer = await (await res.arrayBuffer().then(Buffer.from)).toString();

    let data: unknown;
    try {
      data = JSON.parse(buffer);
    } catch {
      data = buffer;
    }

    const response = {
      res,
      status: res.status,
      data,
    } as { res: Response } & T;

    return response;
  });
}

export async function getFilms() {
  const response: LetterboxdFilm[] = await letterboxd("mikeour");

  const diaryEntries = response.filter((film) => film.type === "diary");

  const films = diaryEntries.map(transformFilm);

  return films;
}

function transformFilm(film: LetterboxdFilm): Film {
  return {
    id: `${film.film.title}-${film.date.watched}`,
    watched: getFormattedDate(film.date.watched),
    title: film.film.title,
    year: film.film.year,
    poster: film.film.image.large,
    rating: film.rating.text,
    review: film.review,
    url: film.uri,
    isRewatch: film.isRewatch,
  };
}
