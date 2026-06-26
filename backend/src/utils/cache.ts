import { redis } from "../lib/redis";


export const invalidateBookCache =
  async (
    bookId?: string
  ) => {
    const keys =
      await redis.keys("books:*");

    if (keys.length > 0) {
      await redis.del(...keys);
    }

    await redis.del("genres");

    if (bookId) {
      await redis.del(
        `book:${bookId}`
      );

      await redis.del(
        `recommendations:${bookId}`
      );
    }
  };