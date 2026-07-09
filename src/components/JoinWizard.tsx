"use client";

import { useState, useTransition } from "react";
import { CATEGORIES, type Category } from "@/db/schema";
import { CATEGORY_META } from "@/lib/categories";
import { joinNeighborhood } from "@/lib/actions";

type Draft = { title: string; category: Category; tags: string[] };

const EMOJI = ["🌻", "🐝", "🦉", "🌵", "🍄", "🦊", "🌈", "🎏"];
const STEPS = ["Your gives", "Your needs", "Stay in the loop"] as const;

function DraftList({
  drafts,
  onRemove,
  tone,
}: {
  drafts: Draft[];
  onRemove: (i: number) => void;
  tone: "give" | "need";
}) {
  if (drafts.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {drafts.map((d, i) => (
        <li
          key={`${d.title}-${i}`}
          className={`flex items-center gap-2 text-sm border rounded-sm px-3 py-1.5 ${
            tone === "give"
              ? "bg-give-soft border-give/40"
              : "bg-need-soft border-need/40"
          }`}
        >
          <span>{CATEGORY_META[d.category].emoji}</span>
          <span className="font-bold">{d.title}</span>
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label={`Remove ${d.title}`}
            className="ml-auto text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}

function DraftEntry({
  tone,
  onAdd,
}: {
  tone: "give" | "need";
  onAdd: (d: Draft) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("other");
  const [tags, setTags] = useState("");

  function add() {
    if (title.trim().length < 3) return;
    onAdd({
      title: title.trim(),
      category,
      tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
    });
    setTitle("");
    setTags("");
    setCategory("other");
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        placeholder={
          tone === "give"
            ? "e.g. Bike repair, sourdough starters, Spanish chats…"
            : "e.g. Help moving a couch, tomato seedlings…"
        }
        className="border border-ink rounded-sm px-3 py-2 bg-paper text-sm"
      />
      <div className="flex gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="border border-ink rounded-sm px-2 py-1.5 bg-paper text-sm flex-1"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
            </option>
          ))}
        </select>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags, comma, separated"
          className="border border-line rounded-sm px-2 py-1.5 bg-paper text-sm flex-1"
        />
        <button
          type="button"
          onClick={add}
          className={`card-pin rounded-sm px-3 py-1.5 text-sm font-bold ${
            tone === "give" ? "text-give" : "text-need"
          }`}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export function JoinWizard() {
  const [step, setStep] = useState(0);
  const [gives, setGives] = useState<Draft[]>([]);
  const [needs, setNeeds] = useState<Draft[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emoji, setEmoji] = useState(EMOJI[0]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await joinNeighborhood({ name, emoji, email, gives, needs });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="max-w-lg mx-auto">
      <ol className="flex gap-2 mb-6 text-xs text-ink-soft">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`px-2 py-1 border rounded-full ${
              i === step
                ? "bg-ink text-paper border-ink"
                : i < step
                  ? "bg-give-soft border-give/40"
                  : "border-line"
            }`}
          >
            {i < step ? "✓ " : `${i + 1}. `}
            {s}
          </li>
        ))}
      </ol>

      <div className="card-pin rounded-sm p-5 flex flex-col gap-4">
        {step === 0 && (
          <>
            <div>
              <h1 className="font-display text-2xl font-semibold">
                What can you <span className="text-give">give</span>? ✋
              </h1>
              <p className="text-sm text-ink-soft mt-1">
                Skills, tools, time, extra zucchini — add as many as you like.
              </p>
            </div>
            <DraftList drafts={gives} onRemove={(i) => setGives(gives.filter((_, j) => j !== i))} tone="give" />
            <DraftEntry tone="give" onAdd={(d) => setGives([...gives, d])} />
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <h1 className="font-display text-2xl font-semibold">
                What do you <span className="text-need">need</span>? 🙏
              </h1>
              <p className="text-sm text-ink-soft mt-1">
                Big or small — a neighbor probably has it covered.
              </p>
            </div>
            <DraftList drafts={needs} onRemove={(i) => setNeeds(needs.filter((_, j) => j !== i))} tone="need" />
            <DraftEntry tone="need" onAdd={(d) => setNeeds([...needs, d])} />
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h1 className="font-display text-2xl font-semibold">
                Where should matches find you? ✉️
              </h1>
              <p className="text-sm text-ink-soft mt-1">
                No passwords. Your email is only shared when you connect with a
                match.
              </p>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={40}
              className="border border-ink rounded-sm px-3 py-2 bg-paper text-sm"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              maxLength={120}
              className="border border-ink rounded-sm px-3 py-2 bg-paper text-sm"
            />
            <fieldset className="flex gap-1.5 flex-wrap">
              <legend className="text-xs text-ink-soft mb-1.5">
                Pick your porch flag
              </legend>
              {EMOJI.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-xl p-1.5 border rounded-sm ${
                    emoji === e ? "border-ink bg-give-soft" : "border-transparent"
                  }`}
                >
                  {e}
                </button>
              ))}
            </fieldset>
            {error && <p className="text-sm text-need">{error}</p>}
          </>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-dashed border-line">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-sm text-ink-soft underline"
            >
              ← Back
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="card-pin rounded-sm px-4 py-2 font-bold text-sm ml-auto"
            >
              {(step === 0 ? gives : needs).length === 0 ? "Skip for now →" : "Next →"}
            </button>
          ) : (
            <button
              type="button"
              disabled={pending || !name.trim() || !email.includes("@")}
              onClick={submit}
              className="card-pin rounded-sm px-4 py-2 font-bold text-sm ml-auto disabled:opacity-50"
            >
              {pending ? "Pinning you up…" : "🌻 See my matches"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
