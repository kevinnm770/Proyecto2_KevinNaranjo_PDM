import { OmdbMovieDetail } from "@/lib/api/types";
import { desc, eq } from "drizzle-orm";
import { db } from "./client";
import { Favorite, favorites } from "./schema";

// Objeto de acceso a datos: todo lo que toca la tabla favorites pasa por
// aqui. Son funciones normales, sin React, para poder usarlas tanto desde
// una pantalla como desde el contexto global.

export async function addFavorite(movie: OmdbMovieDetail): Promise<void> {
  await db
    .insert(favorites)
    .values({
      imdbId: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster === "N/A" ? null : movie.Poster,
      createdAt: Date.now(),
    })
    // Si ya estaba guardada no la duplicamos ni borramos su puntuacion.
    .onConflictDoNothing();
}

export async function removeFavorite(imdbId: string): Promise<void> {
  await db.delete(favorites).where(eq(favorites.imdbId, imdbId));
}

export async function readAllFavorites(): Promise<Favorite[]> {
  return db.select().from(favorites).orderBy(desc(favorites.createdAt));
}

export async function isFavorite(imdbId: string): Promise<boolean> {
  const rows = await db
    .select()
    .from(favorites)
    .where(eq(favorites.imdbId, imdbId));

  return rows.length > 0;
}
