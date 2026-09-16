import { MovieCard } from "@/components/MovieCard";
import { StarRating } from "@/components/StarRating";
import { useFavorites } from "@/hooks/useFavorites";
import { styles } from "@/styles/GlobalStyles";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

const FavoritesScreen = () => {
  const router = useRouter();
  const { favorites, loading, remove } = useFavorites();

  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator style={styles.feedback} />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.hint}>
          Todavía no guardaste ninguna película. Buscá una, abrí su ficha y
          guardala desde ahí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.imdbId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/movie/[id]",
                params: { id: item.imdbId },
              })
            }
          >
            <MovieCard
              title={item.title}
              year={item.year}
              poster={item.poster}
              footer={<StarRating value={item.rating} />}
              right={
                <Pressable
                  onPress={() => remove(item.imdbId)}
                  style={styles.removeButton}
                  // Area tactil propia, para no abrir la ficha sin querer.
                  hitSlop={8}
                >
                  <Text style={styles.removeButtonText}>Quitar</Text>
                </Pressable>
              }
            />
          </Pressable>
        )}
      />
    </View>
  );
};

export default FavoritesScreen;
