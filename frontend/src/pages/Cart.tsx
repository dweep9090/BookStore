import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/order.service";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../services/cart.service";



interface CartItem {
  id: string;
  quantity: number;

  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl: string | null;
  };
}

export default function Cart() {
const navigate = useNavigate();
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchCart = async () => {
    try {
      const data = await getCart();

      setCartItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
  try {
    const order = await createOrder();

    navigate(
      `/checkout/${order.id}`
    );
  } catch (error) {
    console.error(error);
    alert("Failed to create order");
  }
};

  const handleIncrease = async (
    itemId: string,
    quantity: number
  ) => {
    await updateCartItem(
      itemId,
      quantity + 1
    );

    fetchCart();
  };

  const handleDecrease = async (
    itemId: string,
    quantity: number
  ) => {
    if (quantity <= 1) return;

    await updateCartItem(
      itemId,
      quantity - 1
    );

    fetchCart();
  };

  const handleRemove = async (
    itemId: string
  ) => {
    await removeCartItem(itemId);

    fetchCart();
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      item.book.price *
        item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="p-8">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1
        className="mb-8 text-4xl font-bold"
        style={{
          fontFamily:
            "var(--font-serif)",
        }}
      >
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(
              (item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    p-4
                  "
                >
                  <div>
                    <h3 className="font-semibold">
                      {
                        item.book
                          .title
                      }
                    </h3>

                    <p>
                      {
                        item.book
                          .author
                      }
                    </p>

                    <p>
                      ₹
                      {
                        item.book
                          .price
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleDecrease(
                          item.id,
                          item.quantity
                        )
                      }
                      className="
                        rounded
                        border
                        px-3
                        py-1
                      "
                    >
                      -
                    </button>

                    <span>
                      {
                        item.quantity
                      }
                    </span>

                    <button
                      onClick={() =>
                        handleIncrease(
                          item.id,
                          item.quantity
                        )
                      }
                      className="
                        rounded
                        border
                        px-3
                        py-1
                      "
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        handleRemove(
                          item.id
                        )
                      }
                      className="
                        ml-4
                        rounded
                        border
                        px-3
                        py-1
                      "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-8 rounded-lg border p-6">
            <h2 className="text-2xl font-bold">
              Total: ₹{total}
            </h2>

            <button
              onClick={handleCheckout}
              className="
                mt-4
                rounded-lg
                bg-[var(--color-accent)]
                px-6
                py-3
                text-white
              "
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

