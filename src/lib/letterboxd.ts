import * as crypto from "crypto";
import letterboxd from "letterboxd";
import { v4 as uuidv4 } from "uuid";
import { getFormattedDate } from "./utils";

import type { Film, LetterboxdFilm } from "~/types";

export const BASE_URL = "https://api.letterboxd.com/api/v0";

export interface Auth {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
}

const auth: Auth = {
  apiKey: process.env.LETTERBOXD_API_KEY!,
  apiSecret: process.env.LETTERBOXD_API_SECRET!,
  accessToken: process.env.LETTERBOXD_ACCESS_TOKEN!,
};

export interface APIResponse {
  status: number;
  data?: any;
}

function buildUrl(url: string, params?: Record<string, any>) {
  const urlObj = new URL(`${BASE_URL}${url}`);

  if (params) {
    for (const key in params) {
      urlObj.searchParams.set(key, params[key]);
    }
  }

  return urlObj.toString();
}

function buildParams(
  method: string,
  url: string,
  body?: Record<string, any>,
  params: Record<string, any> = {}
) {
  const fullParams = params;
  fullParams.apikey = auth.apiKey;
  fullParams.nonce = uuidv4();
  fullParams.timestamp = Math.floor(Date.now() / 1000);

  const sigBase = [
    method.toUpperCase(),
    buildUrl(url, fullParams),
    body
      ? body instanceof URLSearchParams
        ? body.toString()
        : JSON.stringify(body)
      : "",
  ].join("\u0000");

  fullParams.signature = crypto
    .createHmac("sha256", auth.apiSecret)
    .update(sigBase)
    .digest("hex")
    .toLowerCase();

  return fullParams;
}

export function request<T extends APIResponse>(opts: {
  method: "get" | "post" | "patch" | "delete";
  path: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
}) {
  let formBody;

  if (
    opts.headers &&
    opts.body &&
    opts.headers["Content-Type"] ===
      "application/x-www-form-urlencoded"
  ) {
    formBody = new URLSearchParams();

    for (const key in opts.body) {
      formBody.append(key, opts.body[key]);
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
    body:
      formBody || (opts.body ? JSON.stringify(opts.body) : undefined),
    headers: {
      ...opts.headers,
      ...(auth.accessToken
        ? { Authorization: `Bearer ${auth.accessToken}` }
        : {}),
    },
  }).then(async (res) => {
    // This mess allows us to easily handle `res.json()`, and falling back to `res.text()` if our
    // JSON response isn't actually JSON, without having to clone the response.
    const buffer = await (
      await res.arrayBuffer().then(Buffer.from)
    ).toString();

    let data;
    try {
      data = JSON.parse(buffer);
    } catch (err) {
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
  const response: Array<LetterboxdFilm> = await letterboxd("mikeour");

  const diaryEntries = response.filter(
    (film) => film.type === "diary"
  );

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
