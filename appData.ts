export type FieldKey =
  | "subject"
  | "address"
  | "customer"
  | "device"
  | "serialNumber"
  | "details"
  | "notes"
  | "summary"
  | "counter"
  | "extra1"
  | "extra2"
  | "extra3";

export type FormState = Record<FieldKey, string>;

export const initialForm: FormState = {
  subject: "Kitchen service call",
  address: "42 Demo Street",
  customer: "Acme Foods",
  device: "Espresso Pro 9000",
  serialNumber: "SN-2026-001",
  details: "Machine stops during heating cycle.",
  notes: "Customer says issue is intermittent.",
  summary: "",
  counter: "",
  extra1: "",
  extra2: "",
  extra3: "",
};

export const singleLineFields: {
  key: Exclude<FieldKey, "summary" | "details" | "notes">;
  label: string;
}[] = [
  { key: "subject", label: "Subject" },
  { key: "address", label: "Address" },
  { key: "customer", label: "Customer" },
  { key: "device", label: "Device model" },
  { key: "serialNumber", label: "Serial number" },
  { key: "counter", label: "Usage counter" },
  { key: "extra1", label: "Extra field 1" },
  { key: "extra2", label: "Extra field 2" },
  { key: "extra3", label: "Extra field 3" },
];

export const multiLineFields: {
  key: "details" | "notes" | "summary";
  label: string;
  minHeight: number;
}[] = [
  { key: "details", label: "Request details", minHeight: 96 },
  { key: "notes", label: "Notes", minHeight: 96 },
  { key: "summary", label: "Visit summary", minHeight: 180 },
];

export const orderedFields: FieldKey[] = [
  "subject",
  "address",
  "customer",
  "device",
  "serialNumber",
  "counter",
  "extra1",
  "extra2",
  "extra3",
  "details",
  "notes",
  "summary",
];
