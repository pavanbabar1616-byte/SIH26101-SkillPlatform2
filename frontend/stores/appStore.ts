import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnalysisResult, Employee } from "@/lib/api";

interface AppState {
  selectedEmployee: Employee | null;
  analysis: AnalysisResult | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  clearAnalysis: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedEmployee: null,
      analysis: null,
      setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
      setAnalysis: (analysis) => set({ analysis }),
      clearAnalysis: () => set({ analysis: null, selectedEmployee: null }),
    }),
    {
      name: "sih26101-storage",
    }
  )
);