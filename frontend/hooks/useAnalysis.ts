import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAppStore } from "@/stores/appStore";

export function useAnalyze() {
  const setAnalysis = useAppStore((s) => s.setAnalysis);

  return useMutation({
    mutationFn: (employeeId: string) => api.analyzeProfile(employeeId),
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });
}