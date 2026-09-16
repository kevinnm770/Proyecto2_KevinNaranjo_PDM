import {
  addFavorite,
  readAllFavorites,
  removeFavorite,
  setRating,
} from "@/db/favorites";
import { Favorite } from "@/db/schema";
import { OmdbMovieDetail } from "@/lib/api/types";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type FavoritesContextValue = {
  favorites: Favorite[];
  loading: boolean;
  // Sincrono: la lista ya esta en memoria, no hay que consultar la base.
  isFavorite: (imdbId: string) => boolean;
  toggleFavorite: (movie: OmdbMovieDetail) => Promise<void>;
  remove: (imdbId: string) => Promise<void>;
  // Null en rating quita la puntuacion sin quitar el favorito.
  rate: (movie: OmdbMovieDetail, rating: number | null) => Promise<void>;
  getRating: (imdbId: string) => number | null;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);

// Mantiene en memoria lo que hay en SQLite para que todas las pantallas
// vean el mismo estado. Cada cambio escribe en la base y luego relee.
export const FavoritesProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setFavorites(await readAllFavorites());
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const isFavorite = useCallback(
    (imdbId: string) => favorites.some((item) => item.imdbId === imdbId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (movie: OmdbMovieDetail) => {
      if (favorites.some((item) => item.imdbId === movie.imdbID)) {
        await removeFavorite(movie.imdbID);
      } else {
        await addFavorite(movie);
      }
      await refresh();
    },
    [favorites, refresh],
  );

  const remove = useCallback(
    async (imdbId: string) => {
      await removeFavorite(imdbId);
      await refresh();
    },
    [refresh],
  );

  // Puntuar una pelicula que no estaba guardada la guarda primero: el
  // rating es una columna de favorites, no existe por su cuenta.
  // addFavorite no pisa nada si ya estaba (onConflictDoNothing).
  const rate = useCallback(
    async (movie: OmdbMovieDetail, rating: number | null) => {
      await addFavorite(movie);
      await setRating(movie.imdbID, rating);
      await refresh();
    },
    [refresh],
  );

  const getRating = useCallback(
    (imdbId: string) =>
      favorites.find((item) => item.imdbId === imdbId)?.rating ?? null,
    [favorites],
  );

  const value = useMemo(
    () => ({
      favorites,
      loading,
      isFavorite,
      toggleFavorite,
      remove,
      rate,
      getRating,
    }),
    [favorites, loading, isFavorite, toggleFavorite, remove, rate, getRating],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
