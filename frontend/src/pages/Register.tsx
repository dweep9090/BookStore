import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const registerSchema = z.object({
  name: z
    .string()
    .min(
      2,
      "Name must be at least 2 characters"
    ),

  email: z.email("Invalid email"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});

type RegisterFormData =
  z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver:
      zodResolver(registerSchema),
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      setLoading(true);

      setServerError("");

      const response =
        await api.post(
          "/auth/register",
          {
            name: data.name,
            email: data.email,
            password: data.password,
          }
        );

      const result =
        response.data;

      login(
        result.user,
        result.accessToken,
        result.refreshToken
      );

      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data
            ?.message ??
            "Registration failed"
        );
      } else {
        setServerError(
          "Registration failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-gray-300
          bg-[var(--color-surface)]
          p-8
          shadow-lg
        "
      >
        <h1
          className="
            mb-2
            text-center
            text-4xl
            font-bold
            text-[var(--color-text)]
          "
          style={{
            fontFamily:
              "var(--font-serif)",
          }}
        >
          Create Account
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Join BookStore today
        </p>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="
                w-full
                rounded-lg
                border
                border-gray-400
                bg-transparent
                px-4
                py-3
                text-[var(--color-text)]
                placeholder:text-gray-500
                focus:border-blue-500
                focus:outline-none
              "
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {
                  errors.name
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="
                w-full
                rounded-lg
                border
                border-gray-400
                bg-transparent
                px-4
                py-3
                text-[var(--color-text)]
                placeholder:text-gray-500
                focus:border-blue-500
                focus:outline-none
              "
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {
                  errors.email
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register(
                "password"
              )}
              className="
                w-full
                rounded-lg
                border
                border-gray-400
                bg-transparent
                px-4
                py-3
                text-[var(--color-text)]
                placeholder:text-gray-500
                focus:border-blue-500
                focus:outline-none
              "
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-[var(--color-accent)]
              py-3
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-medium
              text-blue-600
              hover:underline
            "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}