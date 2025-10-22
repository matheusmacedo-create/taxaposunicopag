import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/types/api-keys";
import { getApiKeyForService } from "@/services/api-keys";

export const useApiKey = (service: ApiService) =>
  useQuery(["apiKey", service], () => getApiKeyForService(service), {
    staleTime: 1000 * 60 * 5,
  });
