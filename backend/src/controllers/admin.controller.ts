import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();

    const totalBooks = await prisma.book.count();

    const totalOrders = await prisma.order.count();

    const pendingOrders =
      await prisma.order.count({
        where: {
          status: "PENDING",
        },
      });

    const revenue =
      await prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: "PAID",
        },
      });

    res.status(200).json({
      success: true,
      totalUsers,
      totalBooks,
      totalOrders,
      pendingOrders,
      totalRevenue:
        revenue._sum.totalAmount ?? 0,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard stats",
    });
  }
};


export const getTopRatedBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const books =
    await prisma.book.findMany({
      orderBy: {
        averageRating: "desc",
      },
      take: 10,
    });

  res.json({
    success: true,
    books,
  });
};

export const getRecentOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orders =
    await prisma.order.findMany({
      include: {
        user:{
          select:{
            id:true,
            name:true,
            email:true
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

  res.json({
    success: true,
    orders,
  });
};


export const getStockLogs = async (
  req: Request,
  res: Response
) => {
  try {
    const logs =
      await prisma.stockLog.findMany({
        include: {
          book: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch stock logs",
    });
  }
};