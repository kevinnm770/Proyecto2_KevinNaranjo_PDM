import { DetailRow } from "@/components/DetailRow";
import { addFavorite, isFavorite, removeFavorite } from "@/db/favorites";
import { getMovieById } from "@/lib/api/omdb";
import { OmdbMovieDetail, State } from "@/lib/api/types";
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

  const [favorite, setFavorite] = useState(false);

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

  // Estado inicial del boton: lo decide la base de datos, no la API.
  useEffect(() => {
    isFavorite(id).then(setFavorite);
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

  const handleToggleFavorite = async () => {
    if (!detail) {
      return;
    }

    if (favorite) {
      await removeFavorite(detail.imdbID);
      setFavorite(false);
    } else {
      await addFavorite(detail);
      setFavorite(true);
    }
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
            onPress={handleToggleFavorite}
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
