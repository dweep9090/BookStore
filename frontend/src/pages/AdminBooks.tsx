import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getBooks,
  deleteBook,
  generateSummary,
} from "../services/book.service";

export default function AdminBooks() {
  const [books, setBooks] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    generatingId,
    setGeneratingId,
  ] = useState<string | null>(
    null
  );

  const fetchBooks =
    async () => {
      try {
        const data =
          await getBooks();

        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete =
    async (bookId: string) => {
      const confirmed =
        window.confirm(
          "Delete this book?"
        );

      if (!confirmed) return;

      try {
        await deleteBook(bookId);

        fetchBooks();
      } catch (error) {
        console.error(error);
      }
    };

  const handleGenerateSummary =
    async (bookId: string) => {
      try {
        setGeneratingId(bookId);

        await generateSummary(
          bookId
        );

        alert(
          "AI Summary Generated"
        );

        fetchBooks();
      } catch (error) {
        console.error(error);

        alert(
          "Failed to generate summary"
        );
      } finally {
        setGeneratingId(null);
      }
    };

  if (loading) {
    return (
      <div className="p-8">
        Loading books...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Manage Books
        </h1>

        <Link
          to="/admin/books/new"
          className="
            rounded-lg
            bg-[var(--color-accent)]
            px-5
            py-3
            text-white
          "
        >
          Add New Book
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-3">
                Title
              </th>

              <th className="border p-3">
                Author
              </th>

              <th className="border p-3">
                Price
              </th>

              <th className="border p-3">
                Stock
              </th>

              <th className="border p-3">
                AI Summary
              </th>

              <th className="border p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {books.map(
              (book) => (
                <tr key={book.id}>
                  <td className="border p-3">
                    {book.title}
                  </td>

                  <td className="border p-3">
                    {book.author}
                  </td>

                  <td className="border p-3">
                    ₹{book.price}
                  </td>

                  <td className="border p-3">
                    {book.stock}
                  </td>

                  <td className="border p-3 text-center">
                    {book.aiSummary ? (
                      <span className="text-green-600 font-medium">
                        ✅ Generated
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        ❌ Missing
                      </span>
                    )}
                  </td>

                  <td className="border p-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/books/${book.id}`}
                        className="
                          rounded
                          bg-blue-600
                          px-3
                          py-2
                          text-white
                        "
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            book.id
                          )
                        }
                        className="
                          rounded
                          bg-red-600
                          px-3
                          py-2
                          text-white
                        "
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          handleGenerateSummary(
                            book.id
                          )
                        }
                        disabled={
                          generatingId ===
                          book.id
                        }
                        className="
                          rounded
                          bg-purple-600
                          px-3
                          py-2
                          text-white
                          disabled:opacity-50
                        "
                      >
                        {generatingId ===
                        book.id
                          ? "Generating..."
                          : "AI Summary"}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}