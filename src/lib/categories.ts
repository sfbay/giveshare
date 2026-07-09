import type { Category } from "@/db/schema";

export const CATEGORY_META: Record<Category, { label: string; emoji: string }> = {
  tools: { label: "Tools", emoji: "🔧" },
  "garden-food": { label: "Garden & Food", emoji: "🍅" },
  childcare: { label: "Childcare", emoji: "🧸" },
  "pet-care": { label: "Pet Care", emoji: "🐕" },
  "tech-help": { label: "Tech Help", emoji: "💻" },
  rides: { label: "Rides", emoji: "🚗" },
  lessons: { label: "Lessons", emoji: "🎸" },
  "home-repair": { label: "Home Repair", emoji: "🔨" },
  "arts-crafts": { label: "Arts & Crafts", emoji: "🎨" },
  other: { label: "Other", emoji: "✨" },
};
