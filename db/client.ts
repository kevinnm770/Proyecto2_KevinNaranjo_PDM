import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const expoDb = openDatabaseSync("peliculas.db", {
  enableChangeListener: true,
});

// La tabla se crea al abrir la base. El SQL vive aqui, en la capa de
// datos, para que las pantallas nunca sepan como esta guardado nada.
expoDb.execSync(`
  CREATE TABLE IF NOT EXISTS favorites (
    imdb_id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    type TEXT NOT NULL,
    poster TEXT,
    rating INTEGER,
    created_at INTEGER NOT NULL
  );
`);

export const db = drizzle(expoDb);
