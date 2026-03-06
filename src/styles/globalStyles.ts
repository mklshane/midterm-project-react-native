import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logo: { width: "100%", height: "100%" },
  fallbackLogo: { fontSize: 16, fontWeight: "800", textTransform: "uppercase" },
  companyName: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeAgo: { fontSize: 13, marginTop: 2 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tagBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  logistics: {
    flex: 1,
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
});

/** Shared styles used by both SavedJobsScreen and AppliedJobsScreen. */
export const listScreenStyles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  header: { marginBottom: 20 },
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
});
