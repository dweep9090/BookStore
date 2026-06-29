import { Link } from "react-router-dom";
import { useState } from "react";
import type { Book } from "../types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({
  book,
}: BookCardProps) {
  const [imageError, setImageError] =
    useState(false);

  const imageUrl =
    book.coverUrl ||
    (book.isbn
      ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
      : "");

  return (
    <Link
      to={`/books/${book.id}`}
      className="
        block
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-[var(--color-surface)]
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        dark:border-gray-700
      "
    >
      <div
        className="
          aspect-[3/4]
          overflow-hidden
          bg-gray-100
          dark:bg-gray-800
        "
      >
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={book.title}
            className="h-full w-full object-cover"
            onError={() =>
              setImageError(true)
            }
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              flex-col
              items-center
              justify-center
              bg-gray-200
              dark:bg-gray-700
            "
          >
            <span className="text-6xl">
              📚
            </span>

            <p
              className="
                mt-4
                text-sm
                font-bold
                tracking-[0.25em]
                text-gray-600
                dark:text-gray-300
              "
            >
              NO COVER
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="
            line-clamp-2
            font-bold
            text-[var(--color-text)]
          "
          style={{
            fontFamily:
              "var(--font-serif)",
          }}
        >
          {book.title}
        </h3>

        <p
          className="
            mt-2
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          {book.author}
        </p>

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-lg
              font-bold
              text-[var(--color-text)]
            "
          >
            ₹{book.price}
          </span>

          <span
            className="
              rounded-full
              bg-yellow-100
              px-2
              py-1
              text-sm
              font-medium
              text-yellow-700
            "
          >
            ⭐ {book.averageRating}
          </span>
        </div>
      </div>
    </Link>
  );
}