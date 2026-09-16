import { FavoritesHeaderButton } from "@/components/FavoritesHeaderButton";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Buscador de Películas",
            headerRight: () => <FavoritesHeaderButton />,
          }}
        />
        <Stack.Screen name="favorites" options={{ title: "Mis Favoritos" }} />
        <Stack.Screen name="movie/[id]" options={{ title: "Detalle" }} />
      </Stack>
    </FavoritesProvider>
  );
}
