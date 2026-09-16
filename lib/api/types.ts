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

// Estado unico para cualquier peticion: datos, carga y error.
export interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
