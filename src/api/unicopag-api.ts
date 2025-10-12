// This file contains placeholder functions for API calls.
// In a real application, these would make actual HTTP requests to your backend.

import { toast } from "sonner";

export interface CnpjData {
  cnpj: string;
  razao_social: string;
  cnae_fiscal: string;
  cnae_fiscal_descricao: string;
  endereco: string;
  situacao_cadastral: string;
  mcc: string; // Mapped MCC
}

export interface Proposal {
  type: "Combate" | "Equilibrada" | "Padrao";
  description: string;
  taxa_debito: number;
  taxa_credito_vista: number;
  taxa_credito_parcelado: number;
}

export interface Metrics {
  totalProposals: number;
  acceptedProposals: number;
  averageAcceptedMargin: number;
}

export interface RecentProposal {
  id: string;
  cnpj: string;
  razao_social: string;
  proposalType: string;
  date: string;
}

// Simulate API call to fetch CNPJ data
export const fetchCnpjData = async (cnpj: string): Promise<CnpjData | null> => {
  toast.loading("Buscando dados do CNPJ...", { id: "cnpj-fetch" });
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would call your backend /api/cnpj
    // const response = await fetch(`/api/cnpj?cnpj=${cnpj}`);
    // const data = await response.json();

    // Mock data for demonstration
    const mockData: CnpjData = {
      cnpj: cnpj,
      razao_social: "EMPRESA TESTE LTDA",
      cnae_fiscal: "4711302",
      cnae_fiscal_descricao: "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados",
      endereco: "Rua Exemplo, 123, Centro, São Paulo - SP",
      situacao_cadastral: "ATIVA",
      mcc: "5411", // Mapped from CNAE
    };

    toast.success("Dados do CNPJ encontrados!", { id: "cnpj-fetch" });
    return mockData;
  } catch (error) {
    console.error("Error fetching CNPJ data:", error);
    toast.error("Erro ao buscar dados do CNPJ. Verifique o número e tente novamente.", { id: "cnpj-fetch" });
    return null;
  }
};

// Simulate API call to generate proposals
export const generateProposals = async (
  mcc: string,
  currentRates: { debito: number; creditoVista: number; creditoParcelado: number }
): Promise<Proposal[] | null> => {
  toast.loading("Gerando propostas de taxas...", { id: "proposals-gen" });
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would call your backend /api/sheets to get costs and margins
    // and then calculate proposals.
    // const response = await fetch(`/api/sheets/proposals`, { method: 'POST', body: JSON.stringify({ mcc, currentRates }) });
    // const data = await response.json();

    // Mock data for demonstration
    const mockProposals: Proposal[] = [
      {
        type: "Combate",
        description: "Taxa mínima para vencer concorrência.",
        taxa_debito: 1.29,
        taxa_credito_vista: 1.99,
        taxa_credito_parcelado: 3.49,
      },
      {
        type: "Equilibrada",
        description: "Taxa intermediária, com vantagem em um ponto específico.",
        taxa_debito: 1.49,
        taxa_credito_vista: 2.29,
        taxa_credito_parcelado: 3.79,
      },
      {
        type: "Padrao",
        description: "Taxa com margem maior, para clientes menos sensíveis a preço.",
        taxa_debito: 1.69,
        taxa_credito_vista: 2.59,
        taxa_credito_parcelado: 4.09,
      },
    ];

    toast.success("Propostas geradas com sucesso!", { id: "proposals-gen" });
    return mockProposals;
  } catch (error) {
    console.error("Error generating proposals:", error);
    toast.error("Erro ao gerar propostas de taxas.", { id: "proposals-gen" });
    return null;
  }
};

// Simulate API call to save accepted proposal
export const saveAcceptedProposal = async (
  cnpjData: CnpjData,
  currentRates: { debito: number; creditoVista: number; creditoParcelado: number },
  acceptedProposal: Proposal
): Promise<boolean> => {
  toast.loading("Salvando proposta aceita...", { id: "save-proposal" });
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would call your backend /api/sheets to save data
    // const response = await fetch(`/api/sheets/save-proposal`, { method: 'POST', body: JSON.stringify({ cnpjData, currentRates, acceptedProposal }) });
    // const result = await response.json();

    toast.success("Proposta salva com sucesso!", { id: "save-proposal" });
    return true; // result.success
  } catch (error) {
    console.error("Error saving accepted proposal:", error);
    toast.error("Erro ao salvar proposta aceita.", { id: "save-proposal" });
    return false;
  }
};

// Simulate API call to upload documents
export const uploadDocument = async (
  cnpj: string,
  file: File,
  documentType: string
): Promise<string | null> => {
  toast.loading(`Enviando ${documentType}...`, { id: `upload-${documentType}` });
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would call your backend /api/upload
    // const formData = new FormData();
    // formData.append('cnpj', cnpj);
    // formData.append('file', file);
    // formData.append('documentType', documentType);
    // const response = await fetch(`/api/upload`, { method: 'POST', body: formData });
    // const data = await response.json();

    const mockFileUrl = `https://mock-drive.com/files/${cnpj}/${documentType}/${file.name}`;
    toast.success(`${documentType} enviado com sucesso!`, { id: `upload-${documentType}` });
    return mockFileUrl; // data.fileUrl
  } catch (error) {
    console.error(`Error uploading ${documentType}:`, error);
    toast.error(`Erro ao enviar ${documentType}.`, { id: `upload-${documentType}` });
    return null;
  }
};

// Simulate API call to generate CNPJ card
export const generateCnpjCard = async (cnpj: string): Promise<string | null> => {
  toast.loading("Gerando Cartão CNPJ...", { id: "cnpj-card-gen" });
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would call your backend /api/cnpj to get the card
    // const response = await fetch(`/api/cnpj/card?cnpj=${cnpj}`);
    // const data = await response.json();

    const mockCnpjCardUrl = `https://mock-receita.gov.br/cnpj-card/${cnpj}.pdf`;
    toast.success("Cartão CNPJ gerado com sucesso!", { id: "cnpj-card-gen" });
    return mockCnpjCardUrl; // data.cardUrl
  } catch (error) {
    console.error("Error generating CNPJ card:", error);
    toast.error("Erro ao gerar Cartão CNPJ.", { id: "cnpj-card-gen" });
    return null;
  }
};

// Simulate API call to fetch dashboard metrics
export const fetchDashboardMetrics = async (): Promise<Metrics | null> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockMetrics: Metrics = {
      totalProposals: 150,
      acceptedProposals: 95,
      averageAcceptedMargin: 1.85, // Example percentage
    };
    return mockMetrics;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return null;
  }
};

// Simulate API call to fetch recent proposals
export const fetchRecentProposals = async (): Promise<RecentProposal[] | null> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const mockRecentProposals: RecentProposal[] = [
      { id: "1", cnpj: "12.345.678/0001-00", razao_social: "Padaria do João", proposalType: "Equilibrada", date: "2024-10-26" },
      { id: "2", cnpj: "98.765.432/0001-00", razao_social: "Loja de Roupas Chic", proposalType: "Combate", date: "2024-10-25" },
      { id: "3", cnpj: "11.222.333/0001-00", razao_social: "Restaurante Sabor", proposalType: "Padrao", date: "2024-10-24" },
    ];
    return mockRecentProposals;
  } catch (error) {
    console.error("Error fetching recent proposals:", error);
    return null;
  }
};