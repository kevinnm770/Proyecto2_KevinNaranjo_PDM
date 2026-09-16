import { useFavorites } from "@/hooks/useFavorites";
import { styles } from "@/styles/GlobalStyles";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

// Vive en el header del Stack, dentro del provider, asi el contador se
// actualiza solo cuando se guarda o se quita una pelicula en otra pantalla.
export const FavoritesHeaderButton = () => {
  const router = useRouter();
  const { favorites } = useFavorites();

  return (
    <Pressable
      onPress={() => router.push("/favorites")}
      style={styles.headerButton}
      hitSlop={8}
    >
      <Text style={styles.headerButtonText}>★ {favorites.length}</Text>
    </Pressable>
  );
};
