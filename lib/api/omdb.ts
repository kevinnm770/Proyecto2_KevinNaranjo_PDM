import { request } from "./omdb-client";
import { OmdbSearchItem, OmdbSearchResponse } from "./types";

export async function searchMovies(
  title: string,
  signal?: AbortSignal,
): Promise<OmdbSearchItem[]> {
  const data = await request<OmdbSearchResponse>({ s: title }, signal);
  return data.Search;
}
