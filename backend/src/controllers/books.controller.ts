import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateBookSummary } from "../services/gemini.service";
import { generateRecommendations } from "../services/gemini.service";

import {
  invalidateBookCache,
} from "../utils/cache";

import { redis } from "../lib/redis";

export const getBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q, category, page = "1" } =
      req.query;

    const pageNumber = Number(page);

    const limit = 10;

    const skip =
      (pageNumber - 1) * limit;

    const cacheKey =
      `books:${page}:${q ?? ""}:${category ?? ""}`;

    const cachedBooks =
      await redis.get(cacheKey);

    if (cachedBooks) {
      res.status(200).json({
        success: true,
        count:
          (cachedBooks as any[]).length,
        books: cachedBooks,
        source: "cache",
      });

      return;
    }

    const books =
      await prisma.book.findMany({
        where: {
          AND: [
            q
              ? {
                  OR: [
                    {
                      title: {
                        contains: String(q),
                        mode: "insensitive",
                      },
                    },
                    {
                      author: {
                        contains: String(q),
                        mode: "insensitive",
                      },
                    },
                  ],
                }
              : {},
            category
              ? {
                  category:
                    String(category),
                }
              : {},
          ],
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

    await redis.set(
      cacheKey,
      books,
      {
        ex: 300,
      }
    );

    res.status(200).json({
      success: true,
      count: books.length,
      books,
      source: "database",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch books",
    });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const cacheKey =
      `book:${id}`;

    const cachedBook =
      await redis.get(cacheKey);

    if (cachedBook) {
      res.status(200).json({
        success: true,
        book: cachedBook,
        source: "cache",
      });

      return;
    }

    const book =
      await prisma.book.findUnique({
        where: {
          id,
        },
        include: {
          reviews: true,
        },
      });

    if (!book) {
      res.status(404).json({
        success: false,
        message:
          "Book not found",
      });

      return;
    }

    await redis.set(
      cacheKey,
      book,
      {
        ex: 300,
      }
    );

    res.status(200).json({
      success: true,
      book,
      source: "database",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch book",
    });
  }
};

export const createBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      isbn,
      title,
      author,
      description,
      price,
      stock,
      category,
      genre,
      coverUrl,
    } = req.body;

    const existingBook = await prisma.book.findUnique({
      where: {
        isbn,
      },
    });

    if (existingBook) {
      res.status(400).json({
        success: false,
        message: "Book already exists",
      });
      return;
    }

    const book = await prisma.book.create({
      data: {
        isbn,
        title,
        author,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        genre,
        coverUrl,
      },
    });

    await prisma.stockLog.create({
      data: {
        bookId: book.id,
        delta: book.stock,
        reason: "INITIAL_STOCK",
      },
    });

    await invalidateBookCache();

    res.status(201).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
};

export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = String(req.params.id);

    const existingBook =
      await prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

    if (!existingBook) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    const oldStock = existingBook.stock;

    const updatedBook =
      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          ...req.body,

          price:
            req.body.price !== undefined
              ? Number(req.body.price)
              : undefined,

          stock:
            req.body.stock !== undefined
              ? Number(req.body.stock)
              : undefined,
        },
      });

    const stockDifference =
      updatedBook.stock - oldStock;

    if (stockDifference !== 0) {
      await prisma.stockLog.create({
        data: {
          bookId: updatedBook.id,
          delta: stockDifference,
          reason: "ADMIN_UPDATE",
        },
      });
    }

    await invalidateBookCache(
      bookId
    );


    res.status(200).json({
      success: true,
      book: updatedBook,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
};

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = String(req.params.id);

    const existingBook =
      await prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

    if (!existingBook) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    await invalidateBookCache(
      bookId
    );

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
};

export const generateSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = String(req.params.id);

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

    if (book.aiSummary) {
      res.status(200).json({
        success: true,
        aiSummary: book.aiSummary,
      });
      return;
    }

    const summary =
      await generateBookSummary(
        book.title,
        book.author,
        book.description
      );

    const updatedBook =
      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          aiSummary: summary,
          summaryUpdatedAt: new Date(),
        },
      });

      await invalidateBookCache(
      bookId
    );

    res.status(200).json({
      success: true,
      aiSummary: updatedBook.aiSummary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate summary",
    });
  }
};


export const getRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookId = String(
      req.params.id
    );

    const cacheKey =
      `recommendations:${bookId}`;

    const cachedRecommendations =
      await redis.get(cacheKey);

    if (cachedRecommendations) {
      res.status(200).json({
        success: true,
        recommendations:
          cachedRecommendations,
        source: "cache",
      });

      return;
    }

    const book =
      await prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

    if (!book) {
      res.status(404).json({
        success: false,
        message:
          "Book not found",
      });

      return;
    }

    const recommendationsText =
      await generateRecommendations(
        book.title,
        book.author,
        book.genre,
        book.description
      );

    const cleanedText =
      recommendationsText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let recommendations;

    try {
      recommendations =
        JSON.parse(cleanedText);
    } catch {
      recommendations =
        cleanedText;
    }

    await redis.set(
      cacheKey,
      recommendations,
      {
        ex: 86400,
      }
    );

    res.status(200).json({
      success: true,
      sourceBook: {
        id: book.id,
        title: book.title,
      },
      recommendations,
      source: "database",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to generate recommendations",
    });
  }
};