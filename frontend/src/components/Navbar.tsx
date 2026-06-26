import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } =
    useAuth();

  const { count } = useCart();

  const {
    search,
    setSearch,
    selectedGenre,
    setSelectedGenre,
    genres,
  } = useSearch();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme") ===
        "dark"
    );


  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );
    }
  }, []);

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-gray-200
        bg-[var(--color-surface)]
        backdrop-blur
        dark:border-gray-700
      "
    >
      {/* Top Navbar */}

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          gap-4
          px-4
          py-4
        "
      >
        {/* Logo */}

        <Link
          to="/"
          className="
            text-2xl
            font-bold
            tracking-wide
            text-[var(--color-accent)]
          "
          style={{
            fontFamily:
              "var(--font-serif)",
          }}
        >
          BookStore
        </Link>

        {/* Search + Genre */}

        <div className="hidden flex-1 items-center gap-4 md:flex">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-2
                pl-10
                outline-none
                focus:border-[var(--color-accent)]
                dark:border-gray-700
                dark:bg-gray-800
              "
            />

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-500
              "
            />
          </div>

          <div className="min-w-[220px] max-w-[260px]">
            <Select
              options={genres.map((genre) => ({
                value: genre,
                label: genre,
              }))}
              value={{
                value: selectedGenre,
                label: selectedGenre,
              }}
              onChange={(option) =>
                option &&
                setSelectedGenre(option.value)
              }
              isSearchable
              placeholder="All Genres"
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "42px",
                  borderRadius: "10px",
                  borderColor: "#d1d5db",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text)",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "var(--color-accent)",
                  },
                }),

                menu: (base) => ({
                  ...base,
                  borderRadius: "10px",
                  backgroundColor: "var(--color-surface)",
                  overflow: "hidden",
                  zIndex: 9999,
                }),

                menuList: (base) => ({
                  ...base,
                  backgroundColor: "var(--color-surface)",
                }),

                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "var(--color-accent)"
                    : "var(--color-surface)",
                  color: state.isFocused
                    ? "#fff"
                    : "var(--color-text)",
                  cursor: "pointer",
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "var(--color-text)",
                }),

                input: (base) => ({
                  ...base,
                  color: "var(--color-text)",
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "#6b7280",
                }),

                dropdownIndicator: (base) => ({
                  ...base,
                  color: "#6b7280",
                }),

                indicatorSeparator: () => ({
                  display: "none",
                }),
              }}
            />
          </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}

          <button
            onClick={toggleTheme}
            className="
              rounded-lg
              p-2
              hover:bg-gray-100
              dark:hover:bg-gray-800
            "
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Wishlist */}

          {isAuthenticated && (
            <Link
              to="/wishlist"
              className="
                rounded-lg
                p-2
                hover:bg-gray-100
                dark:hover:bg-gray-800
              "
            >
              <Heart size={20} />
            </Link>
          )}

          {/* Cart */}

          <Link
            to="/cart"
            className="
              relative
              rounded-lg
              p-2
              hover:bg-gray-100
              dark:hover:bg-gray-800
            "
          >
            <ShoppingCart size={20} />

            {count > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  text-xs
                  text-white
                "
              >
                {count}
              </span>
            )}
          </Link>

          {/* Auth */}

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm font-medium text-[var(--color-text)]">
                Hi, {user?.name}
              </span>

              {user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="
                    rounded-md
                    border
                    px-3
                    py-2
                    text-sm
                    font-medium
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                  "
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={logout}
                className="
                  rounded-md
                  bg-[var(--color-accent)]
                  px-3
                  py-2
                  text-sm
                  text-white
                  hover:opacity-90
                "
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/login"
                className="
                  text-sm
                  font-medium
                  text-[var(--color-text)]
                  hover:text-[var(--color-accent)]
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-md
                  bg-[var(--color-accent)]
                  px-3
                  py-2
                  text-sm
                  text-white
                "
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu */}

          <button
            className="md:hidden"
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      

      {/* Mobile Menu */}

      {mobileOpen && (
        <div
          className="
            border-t
            border-gray-200
            px-4
            py-4
            md:hidden
            dark:border-gray-700
          "
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-2
                dark:border-gray-700
                dark:bg-gray-800
              "
            />
          </div>

          <div className="flex flex-col gap-3">
            {isAuthenticated &&
              user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="font-medium text-[var(--color-accent)]"
                >
                  Admin Panel
                </Link>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Genre
              </label>

              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(
                    e.target.value
                  );
                }}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2
                  dark:border-gray-700
                  dark:bg-gray-800
                "
              >
                {genres.map((genre) => (
                  <option
                    key={genre}
                    value={genre}
                  >
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}