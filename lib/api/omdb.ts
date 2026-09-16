import { request } from "./omdb-client";
import {
  OmdbMovieDetail,
  OmdbSearchItem,
  OmdbSearchResponse,
  SearchFilters,
} from "./types";

// OMDb responde "Movie not found!" cuando la busqueda no da resultados.
// Para la app eso no es un error, es una lista vacia.
const NO_RESULTS = "Movie not found!";

export async function searchMovies(
  title: string,
  filters: SearchFilters,
  signal?: AbortSignal,
): Promise<OmdbSearchItem[]> {
  try {
    const data = await request<OmdbSearchResponse>(
      { s: title, type: filters.type, y: filters.year },
      signal,
    );
    return data.Search;
  } catch (error) {
    if ((error as Error).message === NO_RESULTS) {
      return [];
    }
    throw error;
  }
}

export async function getMovieById(
  id: string,
  signal?: AbortSignal,
): Promise<OmdbMovieDetail> {
  return request<OmdbMovieDetail>({ i: id, plot: "short" }, signal);
}
