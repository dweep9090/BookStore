import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateBookSummary = async (
  title: string,
  author: string,
  description?: string | null
): Promise<string> => {
  const prompt = `
You are a book expert.

Generate a concise summary of the following book.

Title: ${title}
Author: ${author}
Description: ${description ?? "Not provided"}

Requirements:
- Maximum 150 words
- Professional tone
- Do not invent plot details if unknown
- Focus on themes, content, and value
`;

  const result = await model.generateContent(
    prompt
  );

  return result.response.text();
};

export const generateBookRecommendations =
  async (
    title: string,
    author: string
  ): Promise<string> => {
    const prompt = `
Recommend 5 books similar to:

Title: ${title}
Author: ${author}

For each recommendation provide:
- Title
- Author
- One-line reason

Keep response concise.
`;

    const result =
      await model.generateContent(prompt);

    return result.response.text();
  };


export const generateRecommendations = async (
  title: string,
  author: string,
  genre?: string | null,
  description?: string | null
) => {
  const prompt = `
You are a book recommendation expert.

Based on this book:

Title: ${title}
Author: ${author}
Genre: ${genre ?? "Unknown"}
Description: ${description ?? "Not provided"}

Recommend exactly 5 similar books.

Return ONLY valid JSON in this format:

[
  {
    "title": "Book Title",
    "author": "Author Name",
    "reason": "Why it is similar"
  }
]

Do not include markdown.
Do not include explanation outside JSON.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};