import { styles } from "@/styles/GlobalStyles";
import { ReactNode } from "react";
import { Image, Text, View } from "react-native";

type Props = {
  title: string;
  year: string;
  // Null cuando no hay poster, venga de OMDb o de la base local.
  poster: string | null;
  // Espacio para una accion al final de la tarjeta, como "Quitar".
  right?: ReactNode;
};

// Presentacional a proposito: no conoce los tipos de OMDb ni los de la
// base, asi la usan igual la busqueda y la lista de favoritos.
export const MovieCard = ({ title, year, poster, right }: Props) => (
  <View style={styles.card}>
    {poster ? (
      <Image source={{ uri: poster }} style={styles.poster} />
    ) : (
      <View style={[styles.poster, styles.posterEmpty]}>
        <Text style={styles.posterEmptyText}>Sin{"\n"}póster</Text>
      </View>
    )}

    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.cardYear}>{year}</Text>
    </View>

    {right}
  </View>
);
