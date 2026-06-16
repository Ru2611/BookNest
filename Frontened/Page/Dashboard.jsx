import React from "react";
import DashboardSidebar from "../Components/DashboardSidebar";
import BookCard from "../Components/card/bookCard";
import { Books } from "../Books";
import { getWishlistIds } from "../lib/wishlist";

const Dashboard = () => {
  const [active, setActive] = React.useState("listings");
  const [sellerName, setSellerName] = React.useState(() => typeof window !== 'undefined' ? window.localStorage.getItem('sellerName') || '' : '');

  const listings = React.useMemo(() => {
    if (!sellerName) return [];
    return Books.filter(b => (b.seller && b.seller.name && b.seller.name.toLowerCase()) === sellerName.toLowerCase());
  }, [sellerName]);

  const wishlist = React.useMemo(() => {
    const ids = getWishlistIds();
    return Books.filter(b => ids.includes(String(b.id)));
  }, []);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <DashboardSidebar active={active} onChange={setActive} />
        </div>

        <div className="md:col-span-3">
          <div className="rounded-lg bg-white p-6 shadow-soft">
            {active === 'listings' && (
              <div>
                <h2 className="text-xl font-semibold mb-3">My Listings</h2>
                <div style={{ marginBottom: 12 }}>
                  <label className="block mb-1">Filter by seller name (for local demo)</label>
                  <input value={sellerName} onChange={(e) => { setSellerName(e.target.value); window.localStorage.setItem('sellerName', e.target.value); }} placeholder="Enter your display name" className="p-2 border rounded w-full" />
                </div>
                {sellerName ? (
                  listings.length ? (
                    <div className="booksContainer">
                      {listings.map(b => <BookCard key={b.id} bookData={b} />)}
                    </div>
                  ) : (
                    <p>No listings found for "{sellerName}".</p>
                  )
                ) : (
                  <p>Please enter your seller display name to filter listings.</p>
                )}
              </div>
            )}

            {active === 'activity' && (
              <div>
                <h2 className="text-xl font-semibold mb-3">My Activity</h2>
                <h3 className="mt-3 font-medium">Wishlist</h3>
                {wishlist.length ? (
                  <div className="booksContainer">
                    {wishlist.map(b => <BookCard key={b.id} bookData={b} />)}
                  </div>
                ) : (
                  <p>No wishlist activity yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
