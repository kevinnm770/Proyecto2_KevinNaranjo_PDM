import { DetailRow } from "@/components/DetailRow";
import { StarRating } from "@/components/StarRating";
import { getMovieById } from "@/lib/api/omdb";
import { OmdbMovieDetail, State } from "@/lib/api/types";
import { useFavorites } from "@/hooks/useFavorites";
import { styles } from "@/styles/GlobalStyles";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

// OMDb rellena con "N/A" los campos que no tiene, asi que los tratamos
// como ausentes en vez de imprimir "N/A" en pantalla.
const omdbValue = (raw?: string) => (raw && raw !== "N/A" ? raw : null);

const MovieDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [movie, setMovie] = useState<State<OmdbMovieDetail>>({
    data: null,
    loading: false,
    error: null,
  });

  const { isFavorite, toggleFavorite, rate, getRating } = useFavorites();

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovie() {
      setMovie({ data: null, loading: true, error: null });
      try {
        const detail = await getMovieById(id, controller.signal);
        setMovie({ data: detail, loading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setMovie({
          data: null,
          loading: false,
          error: (error as Error).message,
        });
      }
    }

    loadMovie();
    return () => controller.abort();
  }, [id]);

  const detail = movie.data;
  const poster = detail ? omdbValue(detail.Poster) : null;

  // Año, clasificacion y duracion en una sola linea, sin huecos.
  const subtitle = detail
    ? [detail.Year, detail.Rated, detail.Runtime]
        .map(omdbValue)
        .filter((part) => part !== null)
        .join("  ·  ")
    : "";

  // El contexto ya tiene la lista en memoria, asi que no hace falta
  // consultar la base para saber si esta guardada.
  const favorite = detail !== null && isFavorite(detail.imdbID);
  const myRating = detail !== null ? getRating(detail.imdbID) : null;

  const handleRate = (star: number) => {
    if (!detail) {
      return;
    }
    // Tocar la estrella que ya estaba puesta quita la puntuacion.
    rate(detail, star === myRating ? null : star);
  };

  return (
    <ScrollView contentContainerStyle={styles.detailScreen}>
      <Stack.Screen options={{ title: detail?.Title ?? "Detalle" }} />

      {movie.loading && <ActivityIndicator style={styles.feedback} />}
      {movie.error && <Text style={styles.error}>{movie.error}</Text>}

      {detail && (
        <View>
          {poster ? (
            <Image source={{ uri: poster }} style={styles.detailPoster} />
          ) : (
            <View style={[styles.detailPoster, styles.posterEmpty]}>
              <Text style={styles.posterEmptyText}>Sin póster</Text>
            </View>
          )}

          <Text style={styles.detailTitle}>{detail.Title}</Text>
          {subtitle !== "" && (
            <Text style={styles.detailSubtitle}>{subtitle}</Text>
          )}

          {omdbValue(detail.imdbRating) && (
            <Text style={styles.detailRating}>
              ★ {detail.imdbRating} / 10 en IMDb
            </Text>
          )}

          <Pressable
            onPress={() => detail && toggleFavorite(detail)}
            style={[
              styles.favoriteButton,
              favorite && styles.favoriteButtonActive,
            ]}
          >
            <Text
              style={[
                styles.favoriteButtonText,
                favorite && styles.favoriteButtonTextActive,
              ]}
            >
              {favorite ? "★  En favoritos" : "☆  Guardar en favoritos"}
            </Text>
          </Pressable>

          <View style={styles.ratingBlock}>
            <Text style={styles.ratingLabel}>Tu puntuación</Text>
            <StarRating value={myRating} onChange={handleRate} />
            <Text style={styles.ratingHint}>
              {myRating === null
                ? "Puntuarla también la guarda en favoritos."
                : "Tocá la misma estrella para quitar la puntuación."}
            </Text>
          </View>

          {omdbValue(detail.Plot) && (
            <Text style={styles.detailPlot}>{detail.Plot}</Text>
          )}

          <View style={styles.detailList}>
            <DetailRow label="Género" value={omdbValue(detail.Genre)} />
            <DetailRow label="Director" value={omdbValue(detail.Director)} />
            <DetailRow label="Reparto" value={omdbValue(detail.Actors)} />
            <DetailRow label="Estreno" value={omdbValue(detail.Released)} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MovieDetailScreen;
