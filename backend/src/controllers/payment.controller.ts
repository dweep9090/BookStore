import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const mockCheckout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
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

    res.status(200).json({
      success: true,
      paymentSession: {
        orderId,
        amount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Checkout failed",
    });
  }
};

export const mockPaymentSuccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.body;
    const existingOrder = await prisma.order.findUnique({
    where: {
        id: orderId,
    },
    });

    if (!existingOrder) {
    res.status(404).json({
        success: false,
        message: "Order not found",
    });
    return;
    }

    if (existingOrder.status === "PAID") {
    res.status(400).json({
        success: false,
        message: "Order already paid",
    });
    return;
    }
    

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "PAID",
      },
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};