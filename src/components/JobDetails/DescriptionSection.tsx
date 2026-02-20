import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { ThemeColors } from "../../styles/colors";

interface Props {
  description: string;
  contentWidth: number;
  colors: ThemeColors;
}

type ParsedSection = {
  title: string;
  items: string[];
};

const stripHtmlTags = (value: string) => value.replace(/<[^>]*>/g, " ");

const decodeEntities = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripEmojis = (value: string) =>
  value.replace(
    /[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}\u{FE0F}]/gu,
    "",
  );

const normalizeText = (value: string) =>
  stripEmojis(decodeEntities(stripHtmlTags(value))).replace(/\s+/g, " ").trim();

const parseSectionsFromHtml = (html: string): ParsedSection[] => {
  const sections: ParsedSection[] = [];
  const sectionPattern = /<h3[^>]*>(.*?)<\/h3>[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  let match: RegExpExecArray | null;

  while ((match = sectionPattern.exec(html)) !== null) {
    const rawTitle = match[1] ?? "";
    const listBlock = match[2] ?? "";
    const title = normalizeText(rawTitle);

    const items = Array.from(listBlock.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
      .map((itemMatch) => normalizeText(itemMatch[1] ?? ""))
      .filter(Boolean);

    if (title && items.length > 0) {
      sections.push({ title, items });
    }
  }

  return sections;
};



const DescriptionSection: React.FC<Props> = ({ description, contentWidth, colors }) => {
  const parsedSections = useMemo(() => parseSectionsFromHtml(description || ""), [description]);

  const cleanedFallbackHtml = useMemo(() => {
    const safeHtml = description || "<p>No description provided.</p>";
    return stripEmojis(safeHtml);
  }, [description]);

  const tagsStyles = {
    body: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 25,
      fontWeight: "400" as const,
    },
    p: { marginBottom: 14, lineHeight: 25 },
    h1: {
      fontSize: 22,
      fontWeight: "800" as const,
      marginTop: 20,
      marginBottom: 10,
      color: colors.text,
    },
    h2: {
      fontSize: 18,
      fontWeight: "700" as const,
      marginTop: 18,
      marginBottom: 8,
      color: colors.text,
    },
    h3: {
      fontSize: 16,
      fontWeight: "700" as const,
      marginTop: 14,
      marginBottom: 6,
      color: colors.text,
    },
    ul: { paddingLeft: 16, marginTop: 4, marginBottom: 14 },
    li: { marginBottom: 6, lineHeight: 23, color: colors.text },
    a: {
      color: colors.text,
      textDecorationLine: "underline" as const,
      fontWeight: "600" as const,
    },
    strong: { fontWeight: "700" as const, color: colors.text },
  } as const;

  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.sectionTitleRow}>
        <View style={[styles.sectionIconBox, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="document-text" size={16} color={colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About This Role</Text>
      </View>

      {parsedSections.length > 0 ? (
        <View style={styles.sectionsWrap}>
          {parsedSections.map((section) => (
            <View
              key={section.title}
              style={[
                styles.sectionCard,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardTitleRow}>
                <View style={[styles.cardAccentBar, { backgroundColor: colors.primary }]} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>{section.title}</Text>
              </View>

              {section.items.map((item) => (
                <View key={`${section.title}-${item}`} style={styles.bulletRow}>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={colors.primary}
                    style={styles.bulletIcon}
                  />
                  <Text style={[styles.bulletText, { color: colors.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: cleanedFallbackHtml }}
          tagsStyles={tagsStyles}
          baseStyle={{ color: colors.text }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", letterSpacing: -0.2 },
  descriptionContainer: { paddingBottom: 8 },
  sectionsWrap: { gap: 10 },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  cardAccentBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
    paddingRight: 4,
    paddingLeft: 4,
  },
  bulletIcon: {
    marginTop: 4,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
});

export default DescriptionSection;
