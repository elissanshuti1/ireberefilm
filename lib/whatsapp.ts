export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `250${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("7")) return `250${digits}`;
  return digits;
}

export function isValidWhatsAppNumber(value: string) {
  const normalized = normalizeWhatsAppNumber(value);
  return normalized.length >= 8 && normalized.length <= 15;
}

export function whatsappUrl(number: string, message = "") {
  const normalized = normalizeWhatsAppNumber(number);
  if (!isValidWhatsAppNumber(normalized)) return "";
  const text = message.trim();
  return `https://wa.me/${normalized}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
