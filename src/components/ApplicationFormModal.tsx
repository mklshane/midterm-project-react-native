import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import ApplicationSuccessModal from "./ApplicationSuccessModal";
import { Job } from "../types";
import { useApplications } from "../contexts/ApplicationsContext";

interface ApplicationFormModalProps {
  visible: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
  job: Job;
  onSuccess: () => void;
}

type FormValues = {
  name: string;
  email: string;
  contact: string;
  coverLetter: string;
};

const EMPTY_FORM_VALUES: FormValues = {
  name: "",
  email: "",
  contact: "",
  coverLetter: "",
};

const hasFormData = (values: FormValues) =>
  Object.values(values).some((value) => value.trim().length > 0);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name is too short")
    .matches(/^[a-zA-Z\s\-'.]+$/, "Name must only contain letters, spaces, hyphens, or apostrophes")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .matches(
      /^[^\s@]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Email must include a valid domain (e.g., example.com)",
    )
    .required("Email is required"),
  contact: Yup.string()
    .trim()
    .matches(/^[\d\s\-()+]+$/, "Contact must contain only digits and valid symbols (+, -, parentheses)")
    .test(
      "digit-count",
      "Contact must have between 7 and 15 digits",
      (value) => {
        if (!value) return false;
        const digitCount = value.replace(/\D/g, "").length;
        return digitCount >= 7 && digitCount <= 15;
      },
    )
    .required("Contact number is required"),
  coverLetter: Yup.string()
    .trim()
    .min(30, "Cover letter is too short")
    .max(500, "Max 500 characters")
    .required("Cover letter is required"),
});

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  visible,
  onClose,
  jobTitle,
  companyName,
  job,
  onSuccess,
}) => {
  const { colors } = useTheme();
  const { addApplication } = useApplications();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const fieldPositions = useRef<Record<string, number>>({});
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const closeFormModal = useCallback(() => {
    setFocusedField(null);
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleAttemptClose = useCallback(() => {
    const currentValues = formikRef.current?.values ?? EMPTY_FORM_VALUES;
    if (hasFormData(currentValues)) {
      setShowDiscardConfirm(true);
      return;
    }

    closeFormModal();
  }, [closeFormModal]);

  const handleConfirmDiscard = useCallback(() => {
    formikRef.current?.resetForm();
    setShowDiscardConfirm(false);
    closeFormModal();
  }, [closeFormModal]);

  const captureFieldPosition = useCallback((key: string, event: LayoutChangeEvent) => {
    fieldPositions.current[key] = event.nativeEvent.layout.y;
  }, []);

  const scrollToField = useCallback((key: string, extraOffset: number = 0) => {
    const targetY = fieldPositions.current[key];
    if (typeof targetY !== "number") return;

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, targetY - (110 + extraOffset)),
        animated: true,
      });
    });
  }, []);

  const handleFieldFocus = useCallback(
    (key: string) => {
      setFocusedField(key);
      scrollToField(key);
    },
    [scrollToField],
  );

  useEffect(() => {
    if (!focusedField || keyboardHeight <= 0) return;

    const timeout = setTimeout(() => {
      scrollToField(focusedField, keyboardHeight * 0.25);
    }, 80);

    return () => clearTimeout(timeout);
  }, [focusedField, keyboardHeight, scrollToField]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) return;

    setShowDiscardConfirm(false);
    setFocusedField(null);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet" // Native bottom-sheet look on iOS
      onRequestClose={handleAttemptClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.modalScroll, { paddingBottom: 60 + keyboardHeight }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        >
          <Formik<FormValues>
            initialValues={EMPTY_FORM_VALUES}
            innerRef={formikRef}
            validationSchema={validationSchema}
            onSubmit={(values, helpers) => {
              helpers.setSubmitting(false);
              helpers.resetForm();
              addApplication(job, values);
              setShowSuccess(true);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Apply for this role</Text>
                    <Text style={[styles.modalSubtitle, { color: colors.mutedText }]}>Complete the form to apply at {companyName}</Text>
                  </View>
                  <Pressable
                    onPress={handleAttemptClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </Pressable>
                </View>

                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
                    <Text style={[styles.badgeText, { color: colors.text }]}>{jobTitle}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Ionicons name="business-outline" size={16} color={colors.primary} />
                    <Text style={[styles.badgeText, { color: colors.text }]}>{companyName}</Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal details</Text>

                <View onLayout={(event) => captureFieldPosition("name", event)}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                  <View
                    style={[
                      styles.inputShell,
                      {
                        borderColor:
                          touched.name && errors.name
                            ? colors.error
                            : focusedField === "name"
                              ? colors.primary
                              : colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <Ionicons name="person-outline" size={18} color={focusedField === "name" ? colors.primary : colors.mutedText} />
                    <TextInput
                      style={[styles.inputInner, { color: colors.text }]}
                      placeholderTextColor={colors.mutedText}
                      placeholder="Jane Doe"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      onFocus={() => handleFieldFocus("name")}
                      value={values.name}
                    />
                  </View>
                </View>
                {touched.name && errors.name ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text>
                ) : null}

                <View onLayout={(event) => captureFieldPosition("email", event)}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                  <View
                    style={[
                      styles.inputShell,
                      {
                        borderColor:
                          touched.email && errors.email
                            ? colors.error
                            : focusedField === "email"
                              ? colors.primary
                              : colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <Ionicons name="mail-outline" size={18} color={focusedField === "email" ? colors.primary : colors.mutedText} />
                    <TextInput
                      style={[styles.inputInner, { color: colors.text }]}
                      placeholderTextColor={colors.mutedText}
                      placeholder="jane@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      onFocus={() => handleFieldFocus("email")}
                      value={values.email}
                    />
                  </View>
                </View>
                {touched.email && errors.email ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
                ) : null}

                <View onLayout={(event) => captureFieldPosition("contact", event)}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Contact Number</Text>
                  <View
                    style={[
                      styles.inputShell,
                      {
                        borderColor:
                          touched.contact && errors.contact
                            ? colors.error
                            : focusedField === "contact"
                              ? colors.primary
                              : colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <Ionicons name="call-outline" size={18} color={focusedField === "contact" ? colors.primary : colors.mutedText} />
                    <TextInput
                      style={[styles.inputInner, { color: colors.text }]}
                      placeholderTextColor={colors.mutedText}
                      placeholder="+639123456789"
                      keyboardType="phone-pad"
                      onChangeText={handleChange("contact")}
                      onBlur={handleBlur("contact")}
                      onFocus={() => handleFieldFocus("contact")}
                      value={values.contact}
                    />
                  </View>
                </View>
                {touched.contact && errors.contact ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.contact}</Text>
                ) : null}

                <View onLayout={(event) => captureFieldPosition("coverLetter", event)}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Why should we hire you?</Text>
                    <Text style={[styles.helperText, { color: colors.mutedText }]}>{values.coverLetter.length}/500</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        borderColor:
                          touched.coverLetter && errors.coverLetter
                            ? colors.error
                            : focusedField === "coverLetter"
                              ? colors.primary
                              : colors.border,
                        color: colors.text,
                        backgroundColor: colors.background,
                      },
                    ]}
                    placeholderTextColor={colors.mutedText}
                    placeholder="Briefly explain why you are a great fit for this position..."
                    multiline
                    maxLength={500}
                    textAlignVertical="top"
                    onChangeText={handleChange("coverLetter")}
                    onBlur={handleBlur("coverLetter")}
                    onFocus={() => handleFieldFocus("coverLetter")}
                    value={values.coverLetter}
                  />
                </View>
                {touched.coverLetter && errors.coverLetter ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>{errors.coverLetter}</Text>
                ) : null}

                <Pressable
                  style={[
                    styles.submitButton,
                    {
                      backgroundColor: colors.buttonPrimary,
                      borderColor: colors.buttonPrimary,
                      opacity: isSubmitting ? 0.8 : 1,
                    },
                  ]}
                  onPress={handleSubmit as () => void}
                  disabled={isSubmitting}
                >
                  <Ionicons name="send" size={18} color={colors.buttonText} style={{ marginRight: 8 }} />
                  <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>Confirm Application</Text>
                </Pressable>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>

      <ApplicationSuccessModal
        visible={showSuccess}
        title="Application submitted"
        message={`We sent your application for ${jobTitle}. Recruiters will reach out if it is a fit.`}
        colors={colors}
        onConfirm={() => {
          setShowSuccess(false);
          closeFormModal();
          onSuccess();
        }}
      />

      {showDiscardConfirm ? (
        <View style={styles.confirmOverlay}>
          <Pressable style={styles.confirmOverlayTapArea} onPress={() => setShowDiscardConfirm(false)} />
          <View style={[styles.confirmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.confirmIconWrap, { backgroundColor: colors.error + "15" }]}>
              <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
            </View>

            <Text style={[styles.confirmTitle, { color: colors.text }]}>Discard this application?</Text>
            <Text style={[styles.confirmSubtitle, { color: colors.mutedText }]}>You have unsaved changes in the form. If you continue, your entered details will be lost.</Text>

            <View style={styles.confirmActions}>
              <Pressable
                style={[styles.confirmCancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setShowDiscardConfirm(false)}
              >
                <Text style={[styles.confirmCancelText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.confirmDiscardButton, { backgroundColor: colors.error }]} onPress={handleConfirmDiscard}>
                <Text style={styles.confirmDiscardText}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1 },
  modalScroll: { padding: 20, flexGrow: 1 },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 24, fontWeight: "800", letterSpacing: -0.2 },
  modalSubtitle: { fontSize: 14, fontWeight: "500", marginTop: 4 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, width: "100%", marginVertical: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    fontSize: 16,
    fontWeight: "500",
  },
  inputShell: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputInner: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 0,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  helperText: { fontSize: 12, fontWeight: "600" },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    height: 140,
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    flexDirection: "row",
    borderWidth: 1,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  errorText: { fontSize: 12, fontWeight: "600", marginTop: 6 },
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confirmOverlayTapArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  confirmCard: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
  },
  confirmIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  confirmSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    textAlign: "center",
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    width: "100%",
  },
  confirmCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  confirmCancelText: {
    fontSize: 15,
    fontWeight: "700",
  },
  confirmDiscardButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDiscardText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ApplicationFormModal;
