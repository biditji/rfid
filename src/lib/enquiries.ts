/**
 * The contact form's subjects. The form offers them and the admin panel reads
 * them back, so both import this list. The values are what the backend's
 * Enquiry model accepts (ENQUIRY_SUBJECTS there).
 */
export const ENQUIRY_SUBJECTS = [
  { value: "quote", label: "Request a quote" },
  { value: "technical", label: "Technical question" },
  { value: "order", label: "Order inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

export const isEnquirySubject = (value: string | undefined): value is (typeof ENQUIRY_SUBJECTS)[number]["value"] =>
  ENQUIRY_SUBJECTS.some((s) => s.value === value);

/** Display label for a stored subject; unknown values show as they are. */
export const enquirySubjectLabel = (value: string) =>
  ENQUIRY_SUBJECTS.find((s) => s.value === value)?.label ?? value;
