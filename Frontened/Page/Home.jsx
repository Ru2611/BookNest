import React from "react";
import { Books } from "../Books";
import BookCard from "../Components/card/bookCard";
import { Link } from "react-router-dom";

export const Home = () => {
  const featured = Books.slice(0, 12);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl pt-8">
        <div className="rounded-3xl bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Discover books near you
              </h2>
              <p className="text-slate-600">
                Buy, sell, or donate—make someone’s day with a good read.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
              <Link
                to="/browse"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Browse listings
              </Link>
              <Link
                to="/add?type=donate"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="booksContainer">
        {featured.map((data) => (
          <BookCard key={data.id} bookData={data} />
        ))}
      </div>
    </div>
  );
};
