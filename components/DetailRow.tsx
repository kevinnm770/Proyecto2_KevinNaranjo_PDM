import { styles } from "@/styles/GlobalStyles";
import { Text, View } from "react-native";

type Props = {
  label: string;
  value: string | null;
};

// No renderiza nada si OMDb no trae el dato (ver omdbValue).
export const DetailRow = ({ label, value }: Props) => {
  if (value === null) {
    return null;
  }

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};
