import { MovieType } from "@/lib/api/types";
import { styles } from "@/styles/GlobalStyles";
import { Pressable, Text, View } from "react-native";

type Option = {
  label: string;
  value: MovieType | "";
};

const OPTIONS: Option[] = [
  { label: "Todos", value: "" },
  { label: "Películas", value: "movie" },
  { label: "Series", value: "series" },
  { label: "Episodios", value: "episode" },
];

type Props = {
  value: MovieType | "";
  onChange: (value: MovieType | "") => void;
};

export const TypeFilter = ({ value, onChange }: Props) => (
  <View style={styles.chipRow}>
    {OPTIONS.map((option) => {
      const selected = option.value === value;

      return (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.chip, selected && styles.chipSelected]}
        >
          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
