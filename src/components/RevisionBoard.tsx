"use client";

import { useEffect, useState } from "react";

type Note = { id: string; title: string; content: string; updatedAt: string };
type Bookmark = { id: string; title: string; url: string; tag: string | null; createdAt: string };

// The "personalized interview revision" feature: private notes and
// bookmarked resources, both scoped entirely to the signed-in user
// (enforced server-side in /api/notes and /api/bookmarks — every route
// checks ownership before reading or writing).
export default function RevisionBoard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [bookmarkForm, setBookmarkForm] = useState({ title: "", url: "", tag: "" });
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    fetch("/api/notes").then((r) => r.json()).then((d) => setNotes(d.notes ?? []));
    fetch("/api/bookmarks").then((r) => r.json()).then((d) => setBookmarks(d.bookmarks ?? []));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteForm),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Couldn't save note.");
      return;
    }
    setNoteForm({ title: "", content: "" });
    refresh();
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    refresh();
  }

  async function addBookmark(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookmarkForm),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Couldn't save bookmark.");
      return;
    }
    setBookmarkForm({ title: "", url: "", tag: "" });
    refresh();
  }

  async function deleteBookmark(id: string) {
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      {error && <p className="text-sm text-rust">{error}</p>}

      <div>
        <h3 className="font-semibold text-sm mb-3">Notes</h3>
        <form onSubmit={addNote} className="border border-paper-line rounded p-4 flex flex-col gap-2 mb-3">
          <input
            placeholder="Title (e.g. RAG re-ranking, quick recap)"
            required
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <textarea
            placeholder="Your notes…"
            required
            rows={3}
            value={noteForm.content}
            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <button type="submit" className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start">
            Save note
          </button>
        </form>
        <div className="flex flex-col gap-2">
          {notes.map((n) => (
            <div key={n.id} className="border border-paper-line rounded p-3.5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-semibold">{n.title}</h4>
                <button onClick={() => deleteNote(n.id)} className="font-mono text-[10.5px] text-ink-soft hover:text-rust">
                  delete
                </button>
              </div>
              <p className="text-sm text-ink-soft whitespace-pre-wrap mt-1">{n.content}</p>
            </div>
          ))}
          {notes.length === 0 && <p className="text-sm text-ink-soft">No notes yet.</p>}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Bookmarked resources</h3>
        <form onSubmit={addBookmark} className="border border-paper-line rounded p-4 flex flex-col gap-2 mb-3">
          <input
            placeholder="Title"
            required
            value={bookmarkForm.title}
            onChange={(e) => setBookmarkForm({ ...bookmarkForm, title: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <input
            placeholder="https://…"
            required
            type="url"
            value={bookmarkForm.url}
            onChange={(e) => setBookmarkForm({ ...bookmarkForm, url: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <input
            placeholder="Tag (optional — e.g. RAG, system design)"
            value={bookmarkForm.tag}
            onChange={(e) => setBookmarkForm({ ...bookmarkForm, tag: e.target.value })}
            className="border border-paper-line rounded px-3 py-2 text-sm bg-paper"
          />
          <button type="submit" className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 self-start">
            Save bookmark
          </button>
        </form>
        <div className="flex flex-col gap-1.5">
          {bookmarks.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-3 border-t border-paper-line py-2 first:border-t-0">
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-ink underline truncate">
                {b.title}
              </a>
              <div className="flex items-center gap-2 flex-none">
                {b.tag && <span className="font-mono text-[10px] uppercase text-ink-soft">{b.tag}</span>}
                <button onClick={() => deleteBookmark(b.id)} className="font-mono text-[10.5px] text-ink-soft hover:text-rust">
                  delete
                </button>
              </div>
            </div>
          ))}
          {bookmarks.length === 0 && <p className="text-sm text-ink-soft">No bookmarks yet.</p>}
        </div>
      </div>
    </div>
  );
}
