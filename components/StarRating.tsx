import { styles } from "@/styles/GlobalStyles";
import { Pressable, Text, View } from "react-native";

const STARS = [1, 2, 3, 4, 5];

type Props = {
  value: number | null;
  // Sin onChange la puntuacion es solo de lectura, como en la lista.
  onChange?: (star: number) => void;
};

export const StarRating = ({ value, onChange }: Props) => {
  const filled = value ?? 0;

  if (!onChange) {
    return (
      <Text style={styles.starsReadOnly}>
        {STARS.map((star) => (filled >= star ? "★" : "☆")).join(" ")}
      </Text>
    );
  }

  return (
    <View style={styles.starsRow}>
      {STARS.map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={6}>
          <Text style={[styles.star, filled >= star && styles.starFilled]}>
            {filled >= star ? "★" : "☆"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
