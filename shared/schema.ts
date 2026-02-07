import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profilingRequests = pgTable("profiling_requests", {
  id: serial("id").primaryKey(),
  targetName: text("target_name").notNull(),
  wordCount: integer("word_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProfilingRequestSchema =
  createInsertSchema(profilingRequests).omit({
    id: true,
    createdAt: true,
  });

export type ProfilingRequest = typeof profilingRequests.$inferSelect;
export type InsertProfilingRequest =
  z.infer<typeof insertProfilingRequestSchema>;

export const generateWordlistSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  keywords: z.string().optional(),
  useLeet: z.boolean().default(false),
  minLen: z.coerce.number().min(0).default(6),
  maxLen: z.coerce.number().min(0).default(20),
});

export type GenerateWordlistRequest =
  z.infer<typeof generateWordlistSchema>;
