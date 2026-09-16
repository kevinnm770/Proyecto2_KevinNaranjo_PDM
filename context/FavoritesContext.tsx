import {
  addFavorite,
  readAllFavorites,
  removeFavorite,
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

  const value = useMemo(
    () => ({ favorites, loading, isFavorite, toggleFavorite, remove }),
    [favorites, loading, isFavorite, toggleFavorite, remove],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
