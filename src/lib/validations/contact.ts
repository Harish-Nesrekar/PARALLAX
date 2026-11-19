import { z } from "zod";

export const contactSchema = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(150).optional().default(""),
  projectType: z.enum([
    "Custom software",
    "Web application",
    "Mobile application",
    "AI and automation",
    "SaaS product",
    "API development",
    "Other"
  ]),
  budget: z.enum([
    "",
    "Under 1 lakh INR",
    "1 to 5 lakh INR",
    "5 to 20 lakh INR",
    "Above 20 lakh INR",
    "Prefer not to say"
  ]).optional().default(""),
  timeline: z.enum([
    "",
    "Under 1 month",
    "1 to 3 months",
    "3 to 6 months",
    "6 months or more",
    "Not sure yet"
  ]).optional().default(""),
  message: z.string().trim().min(20).max(5000),
  consent: z.literal(true),
  turnstileToken: z.string().min(1).max(2048),
  website: z.string().max(200).optional().default("")
});

export type ContactInput = z.infer<typeof contactSchema>;
