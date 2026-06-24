import { useEffect, useState } from "react";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlist.service";

interface WishlistItem {
  id: string;
  bookId: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl: string | null;
  };
}

export default function Wishlist() {
  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();

      setWishlist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (
    bookId: string
  ) => {
    try {
      await removeFromWishlist(bookId);

      fetchWishlist();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1
        className="mb-8 text-4xl font-bold"
        style={{
          fontFamily: "var(--font-serif)",
        }}
      >
        Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                p-4
              "
            >
              <div>
                <h3 className="font-semibold">
                  {item.book.title}
                </h3>

                <p>
                  {item.book.author}
                </p>

                <p>
                  ₹{item.book.price}
                </p>
              </div>

              <button
                onClick={() =>
                  handleRemove(
                    item.bookId
                  )
                }
                className="
                  rounded-lg
                  border
                  px-4
                  py-2
                "
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}