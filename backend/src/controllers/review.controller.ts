import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

const updateBookRating = async (bookId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      bookId,
    },
  });

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount === 0
      ? 0
      : reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviewCount;

  await prisma.book.update({
    where: {
      id: bookId,
    },
    data: {
      averageRating,
      reviewCount,
    },
  });
};

export const createReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const {
      bookId,
      rating,
      content,
    } = req.body;

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
      return;
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    const existingReview =
      await prisma.review.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

    if (existingReview) {
      res.status(400).json({
        success: false,
        message:
          "You have already reviewed this book",
      });
      return;
    }

    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        rating: Number(rating),
        content,
      },
    });

    await updateBookRating(bookId);

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

export const updateReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const reviewId = String(req.params.id);

    const { rating, content } = req.body;

    const review =
      await prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      });

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    if (
      review.userId !== req.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const updatedReview =
      await prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          rating: Number(rating),
          content,
        },
      });

    await updateBookRating(review.bookId);

    res.status(200).json({
      success: true,
      review: updatedReview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

export const deleteReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const reviewId = String(req.params.id);

    const review =
      await prisma.review.findUnique({
        where: {
          id: reviewId,
        },
      });

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    if (
      review.userId !== req.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const bookId = review.bookId;

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    await updateBookRating(bookId);

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

export const getBookReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = String(req.params.bookId);

    const reviews =
      await prisma.review.findMany({
        where: {
          bookId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};