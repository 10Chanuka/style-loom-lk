import { z } from "zod";

// Auth Schemas
export const SignUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Checkout Order Schema
export const WhatsAppOrderSchema = z.object({
  customerName: z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(9, "Valid Sri Lankan phone number is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  customerNotes: z.string().optional(),
});

// Customization Form Schema
export const CustomizationSchema = z.object({
  productType: z.enum(["Printed T-Shirt", "Kurta", "Blouse"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  preferredColour: z.string().optional(),
  preferredFabric: z.string().optional(),
  selectedSize: z.string().optional(),
  measurements: z.record(z.string()).optional(),
  printOrDesignType: z.string().optional(),
  designPlacement: z.string().optional(),
  designDescription: z.string().min(10, "Please provide a brief description of your design ideas"),
  referenceImageUrl: z.string().optional(),
  requiredDate: z.string().optional(),
  estimatedBudget: z.number().optional(),
  customerName: z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(9, "Valid phone number is required"),
  notes: z.string().optional(),
});

// Review Schema
export const ProductReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
});

// Feedback Schema
export const FeedbackSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Admin Product Schema
export const AdminProductSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  productCode: z.string().min(2, "Product code is required"),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  basePrice: z.number().min(0, "Price must be positive"),
  salePrice: z.number().nullable().optional(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]).default("in_stock"),
  careInstructions: z.string().optional(),
  material: z.string().optional(),
});

// Site Settings Schema
export const SiteSettingsSchema = z.object({
  businessName: z.string().min(2),
  logoUrl: z.string().optional().nullable(),
  businessEmail: z.string().email(),
  businessPhone: z.string().min(5),
  whatsappNumber: z.string().min(5),
  address: z.string().min(5),
  aboutContent: z.string().min(10),
  deliveryInformation: z.string().min(5),
  returnPolicy: z.string().min(5),
  primaryColour: z.string().min(4),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
});
