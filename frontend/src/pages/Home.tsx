import { useEffect, useState } from "react";

import BookCard from "../components/BookCard";
import { getBooks } from "../services/book.service";

import type { Book } from "../types/book";

import { useSearch } from "../context/SearchContext";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const booksPerPage = 8;

  const {
    search,
    selectedGenre,
  } = useSearch();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();

        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedGenre]);

  const filteredBooks = books.filter(
    (book) => {
      const matchesSearch =
        book.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        book.author
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesGenre =
        selectedGenre === "ALL" ||
        book.genre === selectedGenre;

      return (
        matchesSearch &&
        matchesGenre
      );
    }
  );

  const totalPages = Math.ceil(
    filteredBooks.length /
      booksPerPage
  );

  const startIndex =
    (currentPage - 1) *
    booksPerPage;

  const paginatedBooks =
    filteredBooks.slice(
      startIndex,
      startIndex + booksPerPage
    );

  if (loading) {
    return (
      <div className="p-8">
        Loading books...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1
        className="mb-8 text-4xl font-bold"
        style={{
          fontFamily:
            "var(--font-serif)",
        }}
      >
        Featured Books
      </h1>

      {filteredBooks.length === 0 ? (
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold">
            No books found
          </h2>

          <p className="mt-2 text-gray-500">
            Try a different search
            term or genre.
          </p>
        </div>
      ) : (
        <>
          <div
            className="
              grid
              gap-6
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {paginatedBooks.map(
              (book) => (
                <BookCard
                  key={book.id}
                  book={book}
                />
              )
            )}
          </div>

          {/* Pagination */}

          {totalPages > 1 && (
            <div
              className="
                mt-10
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
                className="
                  rounded-lg
                  border
                  px-4
                  py-2
                  disabled:opacity-50
                "
              >
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(
                        index + 1
                      )
                    }
                    className={`
                      rounded-lg
                      border
                      px-4
                      py-2
                      ${
                        currentPage ===
                        index + 1
                          ? "bg-[var(--color-accent)] text-white"
                          : ""
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
                className="
                  rounded-lg
                  border
                  px-4
                  py-2
                  disabled:opacity-50
                "
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}