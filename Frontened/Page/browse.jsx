import React, { useEffect, useMemo, useState } from "react";
import BookCard from "../Components/card/bookCard";
import { Books as LocalBooks } from "../Books";
import { useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:8000/books";

const normalizeBook = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id ?? raw._id ?? raw.book_id ?? Math.random(),
    title: raw.title ?? "",
    author: raw.author ?? "",
    genre: raw.genre ?? "",
    condition: raw.condition ?? raw.conditon ?? "",
    price: Number(raw.price ?? 0),
    type: raw.type ?? "",
    description: raw.description ?? "",
    image: raw.image ?? raw.image_url ?? "",
    seller: raw.seller ?? raw.owner ?? null,
  };
};

const bySort = (sortKey) => (a, b) => {
  if (sortKey === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
  if (sortKey === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
  if (sortKey === "title-asc") return (a.title ?? "").localeCompare(b.title ?? "");
  if (sortKey === "title-desc")
    return (b.title ?? "").localeCompare(a.title ?? "");
  return 0;
};

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [source, setSource] = useState("local");
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const g = (searchParams.get("genre") || "all").toLowerCase();
    const t = (searchParams.get("type") || "all").toLowerCase();
    if (q !== query) setQuery(q);
    if (g !== genre) setGenre(g);
    if (t !== type) setType(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const desired = new URLSearchParams();
    if (query.trim()) desired.set("q", query.trim());
    if (genre !== "all") desired.set("genre", genre);
    if (type !== "all") desired.set("type", type);
    if (desired.toString() !== next.toString()) setSearchParams(desired, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, genre, type]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to load");
        const data = await response.json();
        const normalized = (Array.isArray(data) ? data : [])
          .map(normalizeBook)
          .filter(Boolean);
        if (!active) return;
        if (normalized.length) {
          setBooks(normalized);
          setSource("api");
        } else {
          setBooks(LocalBooks);
          setSource("local");
        }
      } catch {
        if (!active) return;
        setBooks(LocalBooks);
        setSource("local");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const genreOptions = useMemo(() => {
    const set = new Set(
      books
        .map((b) => (b.genre || "").toLowerCase())
        .filter((g) => g && g !== "all")
    );
    return ["all", ...Array.from(set)];
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const g = genre.toLowerCase();
    const t = type.toLowerCase();

    return books
      .filter((b) => {
        if (!b) return false;
        const matchesQuery =
          !q ||
          (b.title || "").toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q);
        const matchesGenre = g === "all" || (b.genre || "").toLowerCase() === g;
        const matchesType = t === "all" || (b.type || "").toLowerCase() === t;
        return matchesQuery && matchesGenre && matchesType;
      })
      .slice()
      .sort(bySort(sort));
  }, [books, query, genre, type, sort]);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl pt-6">
        <div className="rounded-2xl bg-white/70 p-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Browse</h2>
              <p className="text-sm text-slate-600">
                {loading ? "Loading…" : `${filtered.length} result(s)`} · source:{" "}
                <span className="font-medium">{source}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or author…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 md:w-72"
              />

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {genreOptions.map((g) => (
                  <option key={g} value={g}>
                    {g === "all" ? "Any genre" : g}
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="all">All listings</option>
                <option value="sell">For sale</option>
                <option value="donate">Free (donation)</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="title-asc">Title: A → Z</option>
                <option value="title-desc">Title: Z → A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="booksContainer">
        {loading ? (
          <p className="text-slate-700">Loading books…</p>
        ) : filtered.length ? (
          filtered.map((b) => <BookCard key={b.id} bookData={b} />)
        ) : (
          <div className="rounded-2xl bg-white/70 p-6 text-slate-700 shadow-soft backdrop-blur">
            No books match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
