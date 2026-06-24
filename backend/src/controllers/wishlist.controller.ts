import { Response } from "express";

import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

export const addToWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const { bookId } = req.body;

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

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: "Book already in wishlist",
      });
      return;
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        bookId,
      },
    });

    res.status(201).json({
      success: true,
      wishlistItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
};

export const removeFromWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const bookId = String(req.params.bookId);

    const userId = req.user!.userId;

    await prisma.wishlist.deleteMany({
      where: {
        userId,
        bookId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
};