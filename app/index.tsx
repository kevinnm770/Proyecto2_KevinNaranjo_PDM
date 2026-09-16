import { MovieCard } from "@/components/MovieCard";
import { searchMovies } from "@/lib/api/omdb";
import { OmdbSearchItem, State } from "@/lib/api/types";
import { styles } from "@/styles/GlobalStyles";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";

const SearchScreen = () => {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState<State<OmdbSearchItem[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const controllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (title.trim() === "") {
      return;
    }

    // Si el usuario busca de nuevo, cancelamos la peticion anterior.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setMovies({ data: null, loading: true, error: null });
    try {
      const results = await searchMovies(title.trim(), controller.signal);
      setMovies({ data: results, loading: false, error: null });
    } catch (error) {
      // Una peticion cancelada no es un error que mostrarle al usuario.
      if (controller.signal.aborted) {
        return;
      }
      setMovies({
        data: null,
        loading: false,
        error: (error as Error).message,
      });
    }
  };

  const isEmpty = !movies.loading && !movies.error && movies.data === null;

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar por nombre"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>

      {movies.loading && <ActivityIndicator style={styles.feedback} />}
      {movies.error && <Text style={styles.error}>{movies.error}</Text>}
      {isEmpty && (
        <Text style={styles.hint}>
          Escribi el nombre de una pelicula para empezar.
        </Text>
      )}

      {movies.data && (
        <FlatList
          data={movies.data}
          keyExtractor={(item) => item.imdbID}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MovieCard movie={item} />}
        />
      )}
    </View>
  );
};

export default SearchScreen;
