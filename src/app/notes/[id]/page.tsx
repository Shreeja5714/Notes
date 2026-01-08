"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NoteDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { id } = await params;
        const res = await fetch(`/api/notes/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load note");
        }
        const data: Note = await res.json();
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load note");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!note) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update note");
      }
      const updated: Note = await res.json();
      setNote(updated);
      setTitle(updated.title);
      setContent(updated.content);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update note");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!note) return;
    if (!confirm("Delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete note");
      }
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete note");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading note...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <div className="space-y-3 text-center">
          <p className="text-sm text-red-500">{error || "Note not found"}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Back to notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="self-start rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          ← Back
        </button>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="mb-4 text-xl font-semibold">Edit note</h1>
          <form onSubmit={handleSave} className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
              >
                Delete
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
            Last updated {new Date(note.updatedAt).toISOString()}
          </p>
          {error && (
            <p className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
