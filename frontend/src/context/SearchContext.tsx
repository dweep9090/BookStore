import {
  createContext,
  useContext,
  useState,
} from "react";

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

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        selectedGenre,
        setSelectedGenre,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () =>
  useContext(SearchContext);