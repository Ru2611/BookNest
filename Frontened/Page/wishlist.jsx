import React, { useEffect, useMemo, useState } from "react";
import BookCard from "../Components/card/bookCard";
import { Books } from "../Books";
import { getWishlistIds, subscribeWishlist } from "../lib/wishlist";

export default function Wishlist() {
  const [ids, setIds] = useState(() => getWishlistIds());

  useEffect(() => subscribeWishlist(() => setIds(getWishlistIds())), []);

  const wishlistedBooks = useMemo(() => {
    if (!ids.length) return [];
    const idSet = new Set(ids.map((v) => String(v)));
    return Books.filter((b) => idSet.has(String(b.id)));
  }, [ids]);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl pt-6">
        <div className="rounded-2xl bg-white/70 p-4 shadow-soft backdrop-blur">
          <h2 className="text-xl font-semibold text-slate-900">Wishlist</h2>
          <p className="text-sm text-slate-600">
            {wishlistedBooks.length} saved book(s)
          </p>
        </div>
      </div>

      <div className="booksContainer">
        {wishlistedBooks.length ? (
          wishlistedBooks.map((b) => <BookCard key={b.id} bookData={b} />)
        ) : (
          <div className="rounded-2xl bg-white/70 p-6 text-slate-700 shadow-soft backdrop-blur">
            Your wishlist is empty. Click the heart on a book to save it.
          </div>
        )}
      </div>
    </div>
  );
}

