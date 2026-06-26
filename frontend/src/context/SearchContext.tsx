import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import {
  getGenres,
} from "../services/book.service";

import type { ReactNode } from "react";

interface SearchContextType {
  search: string;
  setSearch: (
    value: string
  ) => void;

  selectedGenre: string;
  setSelectedGenre: (
    value: string
  ) => void;

  genres: string[];
  setGenres: (
    genres: string[]
  ) => void;
}

const SearchContext =
  createContext<SearchContextType>(
    {} as SearchContextType
  );

export function SearchProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [search, setSearch] =
    useState("");

  const [
    selectedGenre,
    setSelectedGenre,
  ] = useState("ALL");

  const [genres, setGenres] =
    useState<string[]>(["ALL"]);


    useEffect(() => {
    const loadGenres =
      async () => {
        try {
          const data =
            await getGenres();

          setGenres(data);
        } catch (error) {
          console.error(error);
        }
      };

    loadGenres();
  }, []);

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        selectedGenre,
        setSelectedGenre,
        genres,
        setGenres,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () =>
  useContext(SearchContext);