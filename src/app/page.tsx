"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchNotes() {
    try {
      setError(null);
      const res = await fetch("/api/notes");
      if (!res.ok) {
        throw new Error("Failed to load notes");
      }
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
      setError("Could not load notes");
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create note");
      }

      const newNote: Note = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNote(id: string) {
    if (!confirm("Delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete note");
      }
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete note");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Simple CRUD app using Next.js, MongoDB, and Tailwind CSS.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchNotes}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Refresh
          </button>
        </header>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-3 text-lg font-medium">Create a new note</h2>
          <form onSubmit={handleCreateNote} className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? "Creating..." : "Add note"}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </section>

        <section className="flex-1 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-3 text-lg font-medium">Your notes</h2>
          {notes.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No notes yet. Create one above.
            </p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="flex items-start justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/notes/${note._id}`}
                      className="text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      {note.title}
                    </Link>
                    <p className="whitespace-pre-wrap text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {note.content}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
                      Updated {new Date(note.updatedAt).toISOString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note._id)}
                    className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
