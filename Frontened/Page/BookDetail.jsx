import React from "react";

import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { isWishlisted, toggleWishlistId } from "../lib/wishlist";
import { apiGet } from "../lib/api";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const stateBook = location.state;
    if (stateBook) {
      setBook(stateBook);
      setWishlisted(isWishlisted(stateBook.id));
      return;
    }

    if (!id) return;

    apiGet(`/books/${id}`)
      .then((data) => {
        setBook(data);
        setWishlisted(isWishlisted(data?.id ?? id));
      })
      .catch(() => setBook(null));
  }, [id, location.state]);

  if (!book) return <p>Loading...</p>;

  const priceLabel =
    String(book.type).toLowerCase() === "donate" || Number(book.price) === 0
      ? "Free"
      : `₹${Number(book.price)}`;

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl pt-6">
        <div className="mb-4 text-sm text-slate-600">
          <Link to="/browse" className="text-slate-900">
            ← Back to Browse
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/70 shadow-soft backdrop-blur">
            <img
              src={book.image}
              alt={book.title}
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold text-slate-900">
                {book.title}
              </h2>
              <p className="text-slate-700">by {book.author}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                  {priceLabel}
                </span>
                {book.genre ? (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                    {book.genre}
                  </span>
                ) : null}
                {book.condition ? (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                    {book.condition}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Description
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">
                {book.description || "No description provided."}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  toggleWishlistId(book.id ?? id);
                  setWishlisted(isWishlisted(book.id ?? id));
                }}
                className={
                  wishlisted
                    ? "inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                    : "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                }
              >
                {wishlisted ? "Saved ♥" : "Save to Wishlist"}
              </button>

              <button
                type="button"
                onClick={() => setShowMessage((v) => !v)}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Contact Seller
              </button>
            </div>

            {showMessage ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-900">
                  Send a message
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Message saved (demo).");
                    setShowMessage(false);
                  }}
                  className="grid gap-3"
                >
                  <input
                    required
                    placeholder="Your name"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Your email"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                  />
                  <textarea
                    required
                    rows={4}
                    defaultValue={`Hi! I'm interested in "${book.title}". Is it still available?`}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMessage(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
