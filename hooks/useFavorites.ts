import { FavoritesContext } from "@/context/FavoritesContext";
import { useContext } from "react";

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (context === null) {
    throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>.");
  }

  return context;
};
