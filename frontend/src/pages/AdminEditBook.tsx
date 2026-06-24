import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getBookById,
  updateBook,
} from "../services/book.service";

export default function AdminEditBook() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    genre: "",
    coverUrl: "",
  });

  useEffect(() => {
    const loadBook =
      async () => {
        if (!id) return;

        const book =
          await getBookById(id);

        setForm({
          title: book.title,
          author: book.author,
          description:
            book.description || "",
          price: book.price.toString(),
          stock: book.stock.toString(),
          category:
            book.category || "",
          genre:
            book.genre || "",
          coverUrl:
            book.coverUrl || "",
        });
      };

    loadBook();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "price" ||
        name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!id) return;

  try {
    await updateBook(id, form);
    alert("Book updated");
    navigate("/admin/books");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-8 text-4xl font-bold">
        Edit Book
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          name="title"
          value={form.title}
          onChange={
            handleChange
          }
          placeholder="Title"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
        />

        <input
          name="author"
          value={form.author}
          onChange={
            handleChange
          }
          placeholder="Author"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={
            handleChange
          }
          placeholder="Price"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={
            handleChange
          }
          placeholder="Stock"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
        />

        <input
          name="category"
          value={form.category}
          onChange={
            handleChange
          }
          placeholder="Category"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
        />

        <input
          name="genre"
          value={form.genre}
          onChange={
            handleChange
          }
          placeholder="Genre"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
        />

        <input
          name="coverUrl"
          value={form.coverUrl}
          onChange={
            handleChange
          }
          placeholder="Cover URL"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
        />

        <textarea
          name="description"
          value={
            form.description
          }
          onChange={
            handleChange
          }
          rows={5}
          placeholder="Description"
          className="
            w-full
            rounded-lg
            border
            p-3
          "
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
          Save Changes
        </button>
      </form>
    </div>
  );
}