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
  email_proprietario: string; // Novo campo
  telefone_proprietario: string; // Novo campo
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

export interface IdentifiedRates {
  debito: number;
  creditoVista: number;
  creditoParcelado: number;
}

// URL do seu servidor de proxy DeskData
const DESKDATA_PROXY_URL = "http://localhost:3000/api/consulta"; 

// Simulate API call to fetch CNPJ data
export const fetchCnpjData = async (cnpj: string): Promise<CnpjData | null> => {
  toast.loading("Buscando dados do CNPJ...", { id: "cnpj-fetch" });
  try {
    // Chamar o servidor de proxy DeskData
    const response = await fetch(`${DESKDATA_PROXY_URL}?documento=${cnpj}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Erro ao buscar dados do CNPJ no DeskData.");
    }

    const deskData = result.data;

    // Mapear os dados da DeskData para a sua interface CnpjData
    const mappedData: CnpjData = {
      cnpj: deskData.cnpj || cnpj,
      razao_social: deskData.razao_social || deskData.nome_fantasia || "Não informado",
      cnae_fiscal: deskData.cnae_principal_codigo || "Não informado",
      cnae_fiscal_descricao: deskData.cnae_principal_descricao || "Não informado",
      endereco: `${deskData.logradouro || ''}, ${deskData.numero || ''} - ${deskData.bairro || ''}, ${deskData.municipio || ''} - ${deskData.uf || ''}`,
      situacao_cadastral: deskData.situacao_cadastral || "Não informado",
      mcc: deskData.mcc_sugerido || "Não informado", // Assumindo que DeskData pode retornar um MCC
      email_proprietario: deskData.email || "proprietario.teste@exemplo.com", // Usar email da DeskData ou mock
      telefone_proprietario: deskData.telefone || "11987654321", // Usar telefone da DeskData ou mock
    };

    toast.success("Dados do CNPJ encontrados!", { id: "cnpj-fetch" });
    return mappedData;
  } catch (error: any) {
    console.error("Error fetching CNPJ data:", error);
    toast.error(error.message || "Erro ao buscar dados do CNPJ. Verifique o número e tente novamente.", { id: "cnpj-fetch" });
    return null;
  }
};

// Simulate API call to generate proposals
export const generateProposals = async (
  _mcc: string, // Prefixed with _ as it's not directly used in mock
  _currentRates: { debito: number; creditoVista: number; creditoParcelado: number } // Prefixed with _
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
  _cnpjData: CnpjData, // Prefixed with _
  _currentRates: { debito: number; creditoVista: number; creditoParcelado: number }, // Prefixed with _
  _acceptedProposal: Proposal // Prefixed with _
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

// Simulate API call to upload a rate sheet for AI processing
export const uploadRateSheetForAIProcessing = async (_file: File): Promise<IdentifiedRates | null> => {
  toast.loading("Analisando planilha de taxas...", { id: "rate-sheet-ai" });
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate AI processing time

    // In a real app, this would call your backend /api/ai-process-rates
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch(`/api/ai-process-rates`, { method: 'POST', body: formData });
    // const data = await response.json(); // Expected to return { debito, creditoVista, creditoParcelado }

    // Mock data for demonstration
    const mockRates: IdentifiedRates = {
      debito: 1.55,
      creditoVista: 2.35,
      creditoParcelado: 3.85,
    };

    toast.success("Taxas identificadas com sucesso pela IA!", { id: "rate-sheet-ai" });
    return mockRates;
  } catch (error) {
    console.error("Error processing rate sheet with AI:", error);
    toast.error("Erro ao analisar planilha de taxas. Tente novamente.", { id: "rate-sheet-ai" });
    return null;
  }
};

// Simulate API call to send proposal by email
export const sendProposalByEmail = async (
  email: string,
  cnpjData: CnpjData,
  currentRates: { debito: number; creditoVista: number; creditoParcelado: number },
  proposal: Proposal
): Promise<boolean> => {
  toast.loading(`Enviando proposta por e-mail para ${email}...`, { id: "send-email" });
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Simulating email send:", { email, cnpjData, currentRates, proposal });
    toast.success("Proposta enviada por e-mail com sucesso!", { id: "send-email" });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    toast.error("Erro ao enviar proposta por e-mail.", { id: "send-email" });
    return false;
  }
};

// Simulate API call to send proposal by WhatsApp
export const sendProposalByWhatsapp = async (
  phone: string,
  cnpjData: CnpjData,
  currentRates: { debito: number; creditoVista: number; creditoParcelado: number },
  proposal: Proposal
): Promise<boolean> => {
  toast.loading(`Enviando proposta por WhatsApp para ${phone}...`, { id: "send-whatsapp" });
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Simulating WhatsApp send:", { phone, cnpjData, currentRates, proposal });
    toast.success("Proposta enviada por WhatsApp com sucesso!", { id: "send-whatsapp" });
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    toast.error("Erro ao enviar proposta por WhatsApp.", { id: "send-whatsapp" });
    return false;
  }
};