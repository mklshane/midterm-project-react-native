import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 4, paddingTop: 20 },
  footerLoader: { paddingVertical: 16 },
  scrollTopButton: {
    position: "absolute",
    right: 20,
    bottom: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 999,
    elevation: 5,
  },
  scrollTopLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
