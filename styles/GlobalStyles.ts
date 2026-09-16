import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  feedback: {
    marginTop: 24,
  },
  hint: {
    marginTop: 24,
    textAlign: "center",
    color: "#888888",
  },
  error: {
    marginTop: 24,
    textAlign: "center",
    color: "#cc0000",
  },
  list: {
    paddingVertical: 16,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 8,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: "#eeeeee",
  },
  posterEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterEmptyText: {
    fontSize: 11,
    color: "#999999",
    textAlign: "center",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardYear: {
    fontSize: 13,
    color: "#666666",
  },
});
