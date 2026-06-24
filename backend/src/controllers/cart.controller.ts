import { Response } from "express";

import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    });

    res.status(200).json({
      success: true,
      count: cartItems.length,
      cartItems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const { bookId, quantity = 1 } = req.body;

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

    if (book.stock <= 0) {
      res.status(400).json({
        success: false,
        message: "Book out of stock",
      });
      return;
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + Number(quantity),
        },
      });

      res.status(200).json({
        success: true,
        message: "Cart updated",
        cartItem: updatedItem,
      });

      return;
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        bookId,
        quantity: Number(quantity),
      },
    });

    res.status(201).json({
      success: true,
      message: "Book added to cart",
      cartItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
    });
  }
};

export const updateQuantity = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const itemId = String(req.params.itemId);

    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!cartItem) {
      res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity: Number(quantity),
      },
    });

    res.status(200).json({
      success: true,
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update quantity",
    });
  }
};

export const removeItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const itemId = String(req.params.itemId);

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!cartItem) {
      res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
      return;
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove item",
    });
  }
};