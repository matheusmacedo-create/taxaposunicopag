import { ApiKey, ApiKeyFormData, ApiService } from "@/types/api-keys";
import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const fetchApiKeys = async (): Promise<ApiKey[]> =>
  (await axios.get(`${base}/api/settings/api-keys`)).data;

export const addApiKey = async (data: ApiKeyFormData): Promise<ApiKey> =>
  (await axios.post(`${base}/api/settings/api-keys`, data)).data;

export const toggleApiKey = async (id: string, active: boolean): Promise<ApiKey> =>
  (await axios.patch(`${base}/api/settings/api-keys/${id}`, { active })).data;

export const deleteApiKey = async (id: string): Promise<void> =>
  axios.delete(`${base}/api/settings/api-keys/${id}`);

export const getApiKeyForService = async (service: ApiService): Promise<string | null> => {
  try {
    const res = await axios.get(`${base}/api/settings/api-keys/use/${service}`);
    return res.data.key;
  } catch {
    return null;
  }
};
