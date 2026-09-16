import { OmdbSearchItem } from "@/lib/api/types";
import { styles } from "@/styles/GlobalStyles";
import { Image, Text, View } from "react-native";

type Props = {
  movie: OmdbSearchItem;
};

export const MovieCard = ({ movie }: Props) => {
  // OMDb manda "N/A" cuando la pelicula no tiene poster.
  const hasPoster = movie.Poster !== "N/A";

  return (
    <View style={styles.card}>
      {hasPoster ? (
        <Image source={{ uri: movie.Poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterEmpty]}>
          <Text style={styles.posterEmptyText}>Sin{"\n"}poster</Text>
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {movie.Title}
        </Text>
        <Text style={styles.cardYear}>{movie.Year}</Text>
      </View>
    </View>
  );
};
