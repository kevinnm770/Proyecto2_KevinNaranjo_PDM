// Tipos que devuelve OMDb. Los nombres van en mayuscula porque asi
// llegan en el JSON de la API y no los renombramos al parsear.

export interface OmdbSearchItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search: OmdbSearchItem[];
  totalResults: string;
  Response: "True" | "False";
  Error?: string;
}

// Respuesta de detalle (endpoint ?i=imdbID). Trae mas campos que la
// busqueda; entre ellos Genre, que OMDb no expone al buscar.
export interface OmdbMovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Type: string;
  Response: "True" | "False";
  Error?: string;
}

// Categorias que OMDb acepta en el parametro "type".
export type MovieType = "movie" | "series" | "episode";

// Cadena vacia = sin filtrar. buildQuery() descarta los campos vacios.
export interface SearchFilters {
  type: MovieType | "";
  year: string;
}

// Estado unico para cualquier peticion: datos, carga y error.
export interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
