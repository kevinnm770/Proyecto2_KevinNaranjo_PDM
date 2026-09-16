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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelected: {
    borderColor: "#1e6fd9",
    backgroundColor: "#1e6fd9",
  },
  chipText: {
    fontSize: 13,
    color: "#444444",
  },
  chipTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  yearInput: {
    marginTop: 12,
    width: 140,
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
  detailScreen: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#ffffff",
  },
  detailPoster: {
    width: 180,
    height: 270,
    borderRadius: 8,
    alignSelf: "center",
    backgroundColor: "#eeeeee",
  },
  detailTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  detailSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },
  detailRating: {
    marginTop: 8,
    fontSize: 15,
    color: "#1e6fd9",
    fontWeight: "600",
    textAlign: "center",
  },
  detailPlot: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },
  detailList: {
    marginTop: 16,
    gap: 8,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: "#888888",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 14,
    color: "#222222",
  },
});
