export enum ApiService {
  USER_GENERATION = "user_generation",
  CNPJ_SEARCH = "cnpj_search",
  ADDRESS_SEARCH = "address_search",
  WHATSAPP = "whatsapp_integration",
  EMAIL = "email_service",
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret?: string;
  service: ApiService;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
}

export interface ApiKeyFormData {
  name: string;
  key: string;
  secret?: string;
  service: ApiService;
}
