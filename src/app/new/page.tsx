import { redirect } from "next/navigation";
import { CATEGORIES } from "@/db/schema";
import { CATEGORY_META } from "@/lib/categories";
import { createPost } from "@/lib/actions";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/join");
  const { error } = await searchParams;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-semibold mb-1">
        Pin something to the board
      </h1>
      <p className="text-ink-soft text-sm mb-6">
        A <strong className="text-give">Give</strong> is a skill or thing you
        offer. A <strong className="text-need">Need</strong> is something
        you&apos;re looking for.
      </p>
      {error && (
        <p className="mb-4 text-sm text-need border border-need rounded-sm px-3 py-2 bg-need-soft">
          Hmm, that didn&apos;t save — check the title (3+ characters) and try
          again.
        </p>
      )}

      <form
        action={createPost}
        className="card-pin rounded-sm p-5 flex flex-col gap-4"
      >
        <fieldset className="flex gap-2">
          <legend className="sr-only">Kind</legend>
          {(
            [
              ["give", "✋ I can give", "peer-checked:bg-give-soft"],
              ["need", "🙏 I need", "peer-checked:bg-need-soft"],
            ] as const
          ).map(([value, label, checkedBg]) => (
            <label key={value} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="kind"
                value={value}
                defaultChecked={value === "give"}
                className="peer sr-only"
              />
              <span
                className={`block text-center border border-line rounded-sm px-3 py-2 font-bold peer-checked:border-ink ${checkedBg}`}
              >
                {label}
              </span>
            </label>
          ))}
        </fieldset>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-bold">Title</span>
          <input
            name="title"
            required
            minLength={3}
            maxLength={80}
            placeholder="e.g. Sourdough starter + a lesson"
            className="border border-ink rounded-sm px-3 py-2 bg-paper"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-bold">Details</span>
          <textarea
            name="description"
            rows={3}
            maxLength={500}
            placeholder="When, how, anything neighbors should know…"
            className="border border-ink rounded-sm px-3 py-2 bg-paper"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-bold">Category</span>
          <select
            name="category"
            className="border border-ink rounded-sm px-3 py-2 bg-paper"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-bold">
            Tags{" "}
            <span className="font-normal text-ink-soft">
              (comma-separated — these power matching)
            </span>
          </span>
          <input
            name="tags"
            maxLength={120}
            placeholder="bike, repair, weekends"
            className="border border-ink rounded-sm px-3 py-2 bg-paper"
          />
        </label>

        <button
          type="submit"
          className="card-pin rounded-sm px-5 py-2 font-bold self-start"
        >
          📌 Pin it
        </button>
      </form>
    </div>
  );
}
