import { z } from "zod";

export const orderItemSchema = z.object({
  room_name: z.string().trim().min(1, "Room is required"),
  product_type: z.string().trim().min(1, "Product type is required"),
  width: z.coerce.number().positive("Width must be greater than 0"),
  height: z.coerce.number().positive("Height must be greater than 0"),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  stitching_type: z.string().trim().optional(),
  lining: z.string().trim().optional(),
  hardware: z.string().trim().optional(),
  unit_price: z.coerce.number().min(0, "Unit price must be 0 or more"),
  remarks: z.string().trim().optional(),
});

export const orderSchema = z.object({
  customer_id: z.string().trim().min(1, "Customer is required"),
  project_name: z.string().trim().min(1, "Project name is required"),
  site_location: z.string().trim().optional(),
  expected_delivery_date: z.string().trim().min(1, "Expected delivery date is required"),
  priority: z.enum(["Low", "Normal", "High", "Urgent"]),
  status: z.enum(["Draft", "Received", "Production", "Ready", "Dispatched", "Completed", "Cancelled"]),
  remarks: z.string().trim().optional(),
  items: z.array(orderItemSchema).min(1, "Add at least one order item"),
});

export const orderItemDefaultValues = {
  room_name: "",
  product_type: "Curtain",
  width: "",
  height: "",
  quantity: 1,
  stitching_type: "Eyelet",
  lining: "None",
  hardware: "Track",
  unit_price: "",
  remarks: "",
};

export const orderDefaultValues = {
  customer_id: "",
  project_name: "",
  site_location: "",
  expected_delivery_date: "",
  priority: "Normal",
  status: "Draft",
  remarks: "",
  items: [orderItemDefaultValues],
};
