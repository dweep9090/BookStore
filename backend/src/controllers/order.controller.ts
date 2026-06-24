import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createOrder = async (
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

    if (cartItems.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
      return;
    }

    let totalAmount = 0;

    for (const item of cartItems) {
      if (item.quantity > item.book.stock) {
        res.status(400).json({
          success: false,
          message: `${item.book.title} is out of stock`,
        });
        return;
      }

      totalAmount += item.quantity * item.book.price;
    }

    const order = await prisma.$transaction(
      async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId,
            totalAmount,
          },
        });

        for (const item of cartItems) {
          await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.book.price,
            },
          });

          await tx.book.update({
            where: {
              id: item.bookId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          await tx.stockLog.create({
            data: {
              bookId: item.bookId,
              delta: -item.quantity,
              reason: "ORDER_PLACED",
            },
          });
        }

        await tx.cartItem.deleteMany({
          where: {
            userId,
          },
        });

        return newOrder;
      }
    );

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};


export const getOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


export const getOrderById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orderId = String(req.params.id);

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderId = String(req.params.id);

    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "PAID",
      "SHIPPED",
      "DELIVERED",
      "FAILED",
      "CANCELLED",
    ];

    if (
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid status",
      });
      return;
    }

    const order =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    const updatedOrder =
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
        },
      });

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
    });
  }
};