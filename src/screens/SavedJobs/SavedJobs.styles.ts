import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  title: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  subtitle: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  metaRow: { marginTop: 14, flexDirection: "row", alignItems: "center" },
  counter: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  counterText: { fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 },
  separator: { height: 12 },
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: { fontSize: 15, fontWeight: "500" },
});
