import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBookById } from "../services/book.service";
import { addToCart } from "../services/cart.service";
import { addToWishlist } from "../services/wishlist.service";
import toast from "react-hot-toast";



import {
  generateSummary,
  getRecommendations
} from "../services/book.service";

import {
  getBookReviews,
  createReview,
} from "../services/review.service";

import { useAuth } from "../context/AuthContext";

import type { Book, Review } from "../types/book";

export default function BookDetail() {
  const { id } = useParams();

  const { isAuthenticated } = useAuth();

  const [book, setBook] =
    useState<Book | null>(null);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [rating, setRating] =
    useState(5);

  const [content, setContent] =
    useState("");

  const [generatingSummary, setGeneratingSummary] =
    useState(false);

  const [
    recommendations,
    setRecommendations,
  ] = useState<any[]>([]);

const [
    loadingRecommendations,
    setLoadingRecommendations,
  ] = useState(false);

  const fetchReviews = async (
    bookId: string
  ) => {
    try {
      const data =
        await getBookReviews(bookId);

      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart =
    async () => {
      if (!book) return;

      try {
        await addToCart(book.id);

        toast.success("Book added to cart");
      } catch (error) {
        console.error(error);
      }
    };

  const handleAddToWishlist =
    async () => {
      if (!book) return;

      try {
        await addToWishlist(
          book.id
        );

        toast.success(
          "Book added to wishlist"
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleReviewSubmit =
    async () => {
      if (!book) return;

      try {
        await createReview(
          book.id,
          rating,
          content
        );

        setRating(5);
        setContent("");

        await fetchReviews(
          book.id
        );

        const updatedBook =
          await getBookById(
            book.id
          );

        setBook(updatedBook);

        toast.success(
          "Review added successfully"
        );
      } catch (error) {
        console.error(error);
        toast.error(
          "Failed to add review"
        );
      }
    };

    const handleGenerateSummary =
      async () => {
        if (!book) return;

        try {
          setGeneratingSummary(
            true
          );

          const summary =
            await generateSummary(
              book.id
            );

          setBook({
            ...book,
            aiSummary: summary,
          });

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to generate summary.\nPlease try again later."
          );
        } finally {
          setGeneratingSummary(
            false
          );
        }
      };


      const handleRecommendations =
        async () => {
          if (!book) return;

          try {
            setLoadingRecommendations(
              true
            );

            const data =
              await getRecommendations(
                book.id
              );

            setRecommendations(
              data
            );
          } catch (error) {
            console.error(error);

            toast.error(
              "Failed to get recommendations.\nPlease try again later."
            );
          } finally {
            setLoadingRecommendations(
              false
            );
          }
        };

  useEffect(() => {
    const fetchBook =
      async () => {
        try {
          if (!id) return;

          const data =
            await getBookById(id);

          setBook(data);

          await fetchReviews(id);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-8">
        Book not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Cover */}

        <div>
          <div
            className="
              flex
              aspect-[3/4]
              items-center
              justify-center
              rounded-xl
              bg-gray-200
            "
          >
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="
                  h-full
                  w-full
                  rounded-xl
                  object-cover
                "
              />
            ) : (
              <span>
                No Cover
              </span>
            )}
          </div>
        </div>

        {/* Details */}

        <div>
          <h1
            className="
              mb-2
              text-5xl
              font-bold
            "
            style={{
              fontFamily:
                "var(--font-serif)",
            }}
          >
            {book.title}
          </h1>

          <p
            className="
              mb-4
              text-xl
              text-gray-500
            "
          >
            {book.author}
          </p>

          <div className="mb-4">
            <span className="text-yellow-500">
              ⭐
            </span>{" "}
            {book.averageRating.toFixed(
              1
            )}
            {" · "}
            {book.reviewCount}
            {" reviews"}
          </div>

          <p
            className="
              mb-6
              text-3xl
              font-semibold
            "
          >
            ₹{book.price}
          </p>

          <p className="mb-8">
            {book.description}
          </p>

          <div className="mb-8">
  {book.aiSummary ? (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 font-bold text-lg">
        AI Summary
      </h3>

      <p>
        {book.aiSummary}
              </p>
            </div>
          ) : (
            <button
              onClick={
                handleGenerateSummary
              }
              disabled={
                generatingSummary
              }
              className="
                rounded-lg
                bg-purple-600
                px-6
                py-3
                text-white
                disabled:opacity-50
              "
            >
              {generatingSummary
                ? "Generating Summary..."
                : "Generate AI Summary"}
            </button>
          )}
        </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={
                handleAddToCart
              }
              className="
                rounded-lg
                bg-[var(--color-accent)]
                px-6
                py-3
                text-white
              "
            >
              Add to Cart
            </button>

            <button
              onClick={
                handleAddToWishlist
              }
              className="
                rounded-lg
                border
                px-6
                py-3
              "
            >
              Wishlist
            </button>

            <button
                onClick={handleRecommendations}
                className="
                  rounded-lg
                  bg-gradient-to-r
                  from-green-500
                  to-emerald-600
                  px-6
                  py-3
                  font-medium
                  text-white
                  shadow-sm
                  transition
                  hover:opacity-90
                "
              >
                Get Recommendations
              {loadingRecommendations && (
                <div className="mt-8">
                  <p className="italic text-gray-500">
                    Gemini is finding similar books...
                  </p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}

      <div className="mt-16">
        <h2
          className="
            mb-6
            text-3xl
            font-bold
          "
        >
          Reviews
        </h2>

        {reviews.length === 0 ? (
          <p>
            No reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map(
              (review) => (
                <div
                  key={review.id}
                  className="
                    rounded-lg
                    border
                    p-4
                  "
                >
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <strong>
                      {
                        review.user
                          ?.name
                      }
                    </strong>

                    <span>
                      {"⭐".repeat(
                        review.rating
                      )}
                    </span>
                  </div>

                  <p>
                    {
                      review.content
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}



        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2
              className="mb-6 text-3xl font-bold"
              style={{
                fontFamily: "var(--font-serif)",
              }}
            >
              AI Recommended Books
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.map(
                (recommendation, index) => (
                  <div
                    key={index}
                    className="
                      rounded-xl
                      border
                      p-6
                      shadow-sm
                      transition
                      hover:shadow-lg
                    "
                  >
                    <h3 className="mb-2 text-xl font-semibold">
                      {recommendation.title}
                    </h3>

                    <p className="mb-4 text-sm text-gray-500">
                      {recommendation.author}
                    </p>

                    <div
                      className="
                        rounded-lg
                        bg-gray-100
                        p-4
                        dark:bg-gray-800
                      "
                    >
                      <p className="text-sm leading-relaxed">
                        {recommendation.reason}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Review Form */}

        {isAuthenticated && (
          <div
            className="
              mt-10
              rounded-lg
              border
              p-6
            "
          >
            <h3
              className="
                mb-4
                text-xl
                font-semibold
              "
            >
              Write a Review
            </h3>

            <div className="mb-4">
              <label>
                Rating
              </label>

              <select
                value={rating}
                onChange={(
                  e
                ) =>
                  setRating(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  p-2
                "
              >
                <option value={5}>
                  5 Stars
                </option>
                <option value={4}>
                  4 Stars
                </option>
                <option value={3}>
                  3 Stars
                </option>
                <option value={2}>
                  2 Stars
                </option>
                <option value={1}>
                  1 Star
                </option>
              </select>
            </div>

            <textarea
              value={content}
              onChange={(
                e
              ) =>
                setContent(
                  e.target.value
                )
              }
              rows={4}
              placeholder="Write your review..."
              className="
                w-full
                rounded-lg
                border
                p-3
              "
            />

            <button
              onClick={
                handleReviewSubmit
              }
              className="
                mt-4
                rounded-lg
                bg-[var(--color-accent)]
                px-6
                py-3
                text-white
              "
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}