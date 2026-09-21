import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: api.getEmployees,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => api.getEmployee(id),
    enabled: !!id,
  });
}