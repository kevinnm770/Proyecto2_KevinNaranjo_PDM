import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Buscador de Películas" }} />
      <Stack.Screen name="movie/[id]" options={{ title: "Detalle" }} />
    </Stack>
  );
}
