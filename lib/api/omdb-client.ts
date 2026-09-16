const BASE_URL = "https://www.omdbapi.com";

// La key se lee del archivo .env (ver .env.example).
const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;

function buildQuery(params: Record<string, string>) {
  return Object.entries(params)
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
}

export async function request<T>(
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      "Falta la API key: agregala en el archivo .env como EXPO_PUBLIC_OMDB_API_KEY.",
    );
  }

  const query = buildQuery({ apikey: API_KEY, ...params });
  const response = await fetch(`${BASE_URL}/?${query}`, { signal });

  // OMDb explica el error en el cuerpo, incluso cuando responde 401.
  // Por eso leemos el JSON antes de mirar el status.
  const data = await response.json().catch(() => null);

  if (data?.Response === "False") {
    throw new Error(data.Error ?? "OMDb devolvio un error desconocido.");
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return data as T;
}
