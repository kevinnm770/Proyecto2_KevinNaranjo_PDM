import { MovieCard } from "@/components/MovieCard";
import { TypeFilter } from "@/components/TypeFilter";
import { searchMovies } from "@/lib/api/omdb";
import {
  MovieType,
  OmdbSearchItem,
  SearchFilters,
  State,
} from "@/lib/api/types";
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
  const [type, setType] = useState<MovieType | "">("");
  const [year, setYear] = useState("");

  const [movies, setMovies] = useState<State<OmdbSearchItem[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const controllerRef = useRef<AbortController | null>(null);
  // Cambiar un filtro solo relanza la busqueda si ya hubo una antes.
  const hasSearchedRef = useRef(false);

  // Recibe los valores por parametro en vez de leer el estado, porque al
  // tocar un filtro React todavia no actualizo el state correspondiente.
  const runSearch = async (search: string, filters: SearchFilters) => {
    if (search.trim() === "") {
      return;
    }

    if (filters.year !== "" && !/^\d{4}$/.test(filters.year)) {
      setMovies({
        data: null,
        loading: false,
        error: "El año debe tener 4 dígitos, por ejemplo 2005.",
      });
      return;
    }

    // Si el usuario busca de nuevo, cancelamos la peticion anterior.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    hasSearchedRef.current = true;

    setMovies({ data: null, loading: true, error: null });
    try {
      const results = await searchMovies(
        search.trim(),
        filters,
        controller.signal,
      );
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

  const handleSearch = () => runSearch(title, { type, year });

  const handleTypeChange = (nextType: MovieType | "") => {
    setType(nextType);
    // Aplicamos el filtro al instante si ya hay resultados en pantalla.
    if (hasSearchedRef.current) {
      runSearch(title, { type: nextType, year });
    }
  };

  const isEmpty = !movies.loading && !movies.error && movies.data === null;
  const noResults = movies.data !== null && movies.data.length === 0;

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

      <TypeFilter value={type} onChange={handleTypeChange} />

      <TextInput
        placeholder="Año (opcional)"
        style={styles.yearInput}
        value={year}
        onChangeText={setYear}
        onSubmitEditing={handleSearch}
        keyboardType="number-pad"
        maxLength={4}
        returnKeyType="search"
      />

      {movies.loading && <ActivityIndicator style={styles.feedback} />}
      {movies.error && <Text style={styles.error}>{movies.error}</Text>}
      {isEmpty && (
        <Text style={styles.hint}>
          Escribí el nombre de una película para empezar.
        </Text>
      )}

      {noResults && (
        <Text style={styles.hint}>
          No se encontraron resultados. Probá con otro nombre o cambiá los
          filtros.
        </Text>
      )}

      {movies.data && movies.data.length > 0 && (
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
