import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (expected in .env.local)");
  process.exit(1);
}
const sql = neon(url);

const NEIGHBORS = [
  { name: "Rosa M.", emoji: "🌻", email: "rosa@example.com" },
  { name: "Dev P.", emoji: "💻", email: "dev@example.com" },
  { name: "Marguerite L.", emoji: "🐝", email: "marguerite@example.com" },
  { name: "Sam & Ari", emoji: "🌈", email: "samari@example.com" },
  { name: "Ken W.", emoji: "🔨", email: "ken@example.com" },
  { name: "Priya N.", emoji: "🎸", email: "priya@example.com" },
  { name: "Old Joe", emoji: "🌵", email: "joe@example.com" },
  { name: "Fatima H.", emoji: "🍄", email: "fatima@example.com" },
  { name: "Lena K.", emoji: "🦊", email: "lena@example.com" },
  { name: "The Ortiz Family", emoji: "🎏", email: "ortiz@example.com" },
];

// [neighbor index, kind, title, description, category, tags]
const POSTS = [
  [0, "give", "Tomato & pepper seedlings every spring", "I always start way too many. Heirlooms mostly.", "garden-food", ["tomatoes", "seedlings", "garden"]],
  [0, "need", "Someone to fix a wobbly fence gate", "One hinge post is leaning. I have lemonade.", "home-repair", ["fence", "gate", "repair"]],
  [1, "give", "Tech help for elders — patient, promise", "Phones, printers, mystery pop-ups. Sunday afternoons.", "tech-help", ["phones", "printers", "patience"]],
  [1, "need", "Fresh garden veggies", "I will trade unlimited IT support for tomatoes.", "garden-food", ["tomatoes", "veggies"]],
  [2, "give", "Beekeeping intro + honey samples", "Meet the hive! Suits provided, ages 10+.", "lessons", ["bees", "honey", "backyard"]],
  [2, "need", "Ride to the farmers market Saturdays", "Early bird, happy to chip in for gas.", "rides", ["saturday", "market", "morning"]],
  [3, "give", "Toddler clothes & toys, gently loved", "Bins of 2T–4T, wooden toys, board books.", "childcare", ["toddler", "clothes", "toys"]],
  [3, "need", "Occasional evening babysitting swap", "Two kids, easy bedtime. We'll return the favor!", "childcare", ["babysitting", "evening", "swap"]],
  [4, "give", "Power tools to borrow + repair coaching", "Drill, circular saw, sander. I'll show you how.", "tools", ["drill", "saw", "lending"]],
  [4, "need", "Guitar lessons for a stubborn beginner", "Retired hands, big dreams. Prefer weekends.", "lessons", ["guitar", "beginner", "weekends"]],
  [5, "give", "Guitar lessons — folk, blues, patience included", "15 years teaching. Kids and adults welcome.", "lessons", ["guitar", "music", "beginner"]],
  [5, "need", "Borrow a drill for a weekend project", "Hanging shelves, should take an afternoon.", "tools", ["drill", "weekend"]],
  [6, "give", "Rides to appointments, weekday mornings", "Got a truck too, if something big needs moving.", "rides", ["weekday", "truck", "moving"]],
  [6, "need", "Help setting up a new phone", "The buttons moved again. Bring patience.", "tech-help", ["phones", "setup"]],
  [7, "give", "Sourdough starter + first-loaf lesson", "Twelve-year-old starter named Clint Yeastwood.", "garden-food", ["sourdough", "baking", "starter"]],
  [7, "need", "Watercolor basics for two lefties", "Me and my kid want to learn together.", "arts-crafts", ["watercolor", "painting", "kids"]],
  [8, "give", "Watercolor & sketching sessions in the park", "Casual Sunday sessions, supplies to share.", "arts-crafts", ["watercolor", "sketching", "sunday"]],
  [8, "need", "Dog walking backup on busy weeks", "Sweet old beagle, slow walker, treat-motivated.", "pet-care", ["dog", "walking", "beagle"]],
  [9, "give", "After-school dog walking (kids + leash pro mom)", "Our crew walks the block at 3:30 daily.", "pet-care", ["dog", "walking", "afterschool"]],
  [9, "need", "Extra bike, any size, for a growing kid", "Will trade tamales. Serious offer.", "other", ["bike", "kids", "trade"]],
];

console.log("Seeding neighborhood…");

const existing = await sql`SELECT count(*)::int AS n FROM users`;
if (existing[0].n > 0) {
  console.log(`Skipping: ${existing[0].n} users already present. TRUNCATE users CASCADE to reseed.`);
  process.exit(0);
}

const userIds = [];
for (const u of NEIGHBORS) {
  const [row] = await sql`
    INSERT INTO users (name, emoji, email)
    VALUES (${u.name}, ${u.emoji}, ${u.email})
    RETURNING id`;
  userIds.push(row.id);
}

for (const [who, kind, title, description, category, tags] of POSTS) {
  await sql`
    INSERT INTO posts (user_id, kind, title, description, category, tags)
    VALUES (${userIds[who]}, ${kind}, ${title}, ${description}, ${category}, ${tags})`;
}

console.log(`Seeded ${NEIGHBORS.length} neighbors and ${POSTS.length} posts. 🌻`);
