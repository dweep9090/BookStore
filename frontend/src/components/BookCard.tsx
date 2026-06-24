import { Link } from "react-router-dom";
import type { Book } from "../types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({
  book,
}: BookCardProps) {
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
          flex
          items-center
          justify-center
          bg-gray-100
          dark:bg-gray-800
        "
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400">
            No Cover
          </span>
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