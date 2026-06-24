import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createBook } from "../services/book.service";

export default function AdminCreateBook() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    isbn: "",
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    genre: "",
    coverUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        await createBook({
          ...form,
          price: Number(
            form.price
          ),
          stock: Number(
            form.stock
          ),
        });

        alert(
          "Book created successfully"
        );

        navigate(
          "/admin/books"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to create book"
        );
      }
    };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1
        className="mb-8 text-4xl font-bold"
        style={{
          fontFamily:
            "var(--font-serif)",
        }}
      >
        Add New Book
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          name="isbn"
          value={form.isbn}
          onChange={
            handleChange
          }
          placeholder="ISBN"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="title"
          value={form.title}
          onChange={
            handleChange
          }
          placeholder="Title"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="author"
          value={form.author}
          onChange={
            handleChange
          }
          placeholder="Author"
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="description"
          value={
            form.description
          }
          onChange={
            handleChange
          }
          rows={4}
          placeholder="Description"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={
            handleChange
          }
          placeholder="Price"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={
            handleChange
          }
          placeholder="Stock"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="category"
          value={
            form.category
          }
          onChange={
            handleChange
          }
          placeholder="Category"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="genre"
          value={form.genre}
          onChange={
            handleChange
          }
          placeholder="Genre"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="coverUrl"
          value={
            form.coverUrl
          }
          onChange={
            handleChange
          }
          placeholder="Cover URL"
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          className="
            rounded-lg
            bg-[var(--color-accent)]
            px-6
            py-3
            text-white
          "
        >
          Create Book
        </button>
      </form>
    </div>
  );
}