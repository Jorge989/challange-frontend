// useSearchStore.ts
import { create } from "zustand";
import type { Transaction } from "@/types";

interface SearchState {
  query: string;
  setQuery: (query: string) => void;

  selectedTransaction: Transaction | null;
  setSelectedTransaction: (txn: Transaction | null) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),

  selectedTransaction: null,
  setSelectedTransaction: (txn) => set({ selectedTransaction: txn }),
}));
