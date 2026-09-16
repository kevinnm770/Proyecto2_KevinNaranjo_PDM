import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const favorites = sqliteTable("favorites", {
  // El imdbID identifica la pelicula en OMDb, asi que sirve de llave
  // primaria y evita que se guarde dos veces la misma.
  imdbId: text("imdb_id").primaryKey(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  type: text("type").notNull(),
  // Null cuando OMDb no tiene poster (manda "N/A").
  poster: text("poster"),
  // Puntuacion del usuario, 1 a 5. Null mientras no la haya puesto.
  rating: integer("rating"),
  createdAt: integer("created_at").notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
