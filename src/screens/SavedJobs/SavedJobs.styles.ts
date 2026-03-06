import { StyleSheet } from "react-native";
import { listScreenStyles } from "../../styles/globalStyles";

export const styles = StyleSheet.create({
  ...listScreenStyles,
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: { fontSize: 15, fontWeight: "500" },
});
