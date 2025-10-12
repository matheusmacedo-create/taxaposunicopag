"use client";

import { toast } from "sonner";

// Define o URL base da API. Em produção, ele virá da variável de ambiente VITE_API_BASE_URL.
// Em desenvolvimento, ele usará http://localhost:3000 como padrão.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface CnpjData {
  cnpj: string;
  razao_social: string;
  cnae_fiscal: string;
  cnae_fiscal_descricao: string;
  endereco: string;
  situacao_cadastral: string;
  mcc: string;
  email_proprietario: string;
  telefone_proprietario: string;
}

export interface IdentifiedRates {
  debito: number;
  creditoVista: number;
  creditoParcelado: number;
}

export interface Proposal {
  type: string;
  description: string;
  taxa_debito: number;
  taxa_credito_vista: number;
  taxa_credito_parcelado: number;
}

// Função auxiliar para lidar com erros de resposta da API
async function handleApiResponse(response: Response, errorMessage: string) {
  if (!response.ok) {
    const errorData = await response.json();
    toast.error(`${errorMessage}: ${errorData.message || response.statusText}`);
    return null;
  }
  return response.json();
}

export async function fetchCnpjData(cnpj: string): Promise<CnpjData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cnpj/${cnpj}`);
    const data = await handleApiResponse(response, "Erro ao buscar CNPJ");
    if (data) {
      toast.success("CNPJ encontrado com sucesso!");
    }
    return data;
  } catch (error) {
    console.error("Error fetching CNPJ data:", error);
    toast.error("Erro de rede ao buscar CNPJ. Verifique sua conexão ou o servidor.");
    return null;
  }
}

export async function uploadRateSheetForAIProcessing(file: File): Promise<IdentifiedRates | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/api/upload-rate-sheet`, {
      method: "POST",
      body: formData,
    });
    return handleApiResponse(response, "Erro ao analisar planilha");
  } catch (error) {
    console.error("Error uploading rate sheet:", error);
    toast.error("Erro de rede ao analisar planilha.");
    return null;
  }
}

export async function generateProposals(mcc: string, currentRates: IdentifiedRates): Promise<Proposal[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-proposals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mcc, currentRates }),
    });
    const data = await handleApiResponse(response, "Erro ao gerar propostas");
    return data || [];
  } catch (error) {
    console.error("Error generating proposals:", error);
    toast.error("Erro de rede ao gerar propostas.");
    return [];
  }
}

export async function saveAcceptedProposal(
  cnpjData: CnpjData,
  currentRates: IdentifiedRates,
  selectedProposal: Proposal
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/save-proposal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cnpjData, currentRates, selectedProposal }),
    });
    const data = await handleApiResponse(response, "Erro ao salvar proposta");
    if (data) {
      toast.success("Proposta salva com sucesso!");
    }
    return !!data;
  } catch (error) {
    console.error("Error saving accepted proposal:", error);
    toast.error("Erro de rede ao salvar proposta.");
    return false;
  }
}

export async function uploadDocument(cnpj: string, file: File, documentType: string): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cnpj", cnpj);
    formData.append("documentType", documentType);

    const response = await fetch(`${API_BASE_URL}/api/upload-document`, {
      method: "POST",
      body: formData,
    });
    const data = await handleApiResponse(response, `Erro ao fazer upload de ${documentType}`);
    return data ? data.url : null; // Assumindo que o backend retorna uma URL
  } catch (error) {
    console.error(`Error uploading ${documentType}:`, error);
    toast.error(`Erro de rede ao fazer upload de ${documentType}.`);
    return null;
  }
}

export async function generateCnpjCard(cnpj: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-cnpj-card/${cnpj}`);
    const data = await handleApiResponse(response, "Erro ao gerar Cartão CNPJ");
    return data ? data.url : null; // Assumindo que o backend retorna uma URL para o cartão gerado
  } catch (error) {
    console.error("Error generating CNPJ card:", error);
    toast.error("Erro de rede ao gerar Cartão CNPJ.");
    return null;
  }
}

export async function sendProposalByEmail(email: string, cnpjData: CnpjData, currentRates: IdentifiedRates, proposal: Proposal): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, cnpjData, currentRates, proposal }),
    });
    const data = await handleApiResponse(response, "Erro ao enviar e-mail");
    return !!data;
  } catch (error) {
    console.error("Error sending email:", error);
    toast.error("Erro de rede ao enviar e-mail.");
    return false;
  }
}

export async function sendProposalByWhatsapp(phone: string, cnpjData: CnpjData, currentRates: IdentifiedRates, proposal: Proposal): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-whatsapp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, cnpjData, currentRates, proposal }),
    });
    const data = await handleApiResponse(response, "Erro ao enviar WhatsApp");
    return !!data;
  } catch (error) {
    console.error("Error sending WhatsApp:", error);
    toast.error("Erro de rede ao enviar WhatsApp.");
    return false;
  }
}