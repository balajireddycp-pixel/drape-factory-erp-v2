import { z } from "zod";

export const customerSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required"),
  contact_person: z.string().trim().min(1, "Contact person is required"),
  mobile: z
    .string()
    .trim()
    .min(1, "Mobile is required")
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid mobile number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
  gstin: z.string().trim().optional(),
  billing_address: z.string().trim().optional(),
  shipping_address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  pincode: z.string().trim().optional(),
  credit_days: z.coerce.number().int().min(0, "Must be 0 or more").optional(),
  status: z.enum(["Active", "Inactive"]),
  notes: z.string().trim().optional(),
});

export const customerDefaultValues = {
  company_name: "",
  contact_person: "",
  mobile: "",
  email: "",
  gstin: "",
  billing_address: "",
  shipping_address: "",
  city: "",
  state: "",
  pincode: "",
  credit_days: 0,
  status: "Active",
  notes: "",
};
