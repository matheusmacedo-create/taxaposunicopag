"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CnpjData,
  fetchCnpjData,
  generateProposals,
  Proposal,
  saveAcceptedProposal,
  uploadDocument,
  generateCnpjCard,
  uploadRateSheetForAIProcessing,
  IdentifiedRates,
  sendProposalByEmail,
  sendProposalByWhatsapp,
} from "@/api/unicopag-api";
import { toast } from "sonner";
import { Loader2, Upload, CheckCircle2, XCircle, FileText, Mail, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Helper function to format CNPJ
const formatCnpj = (value: string) => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
  }
  return cleaned;
};

// Helper function to format phone number
const formatPhone = (value: string) => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return cleaned;
};

// Mock CNPJ Data for simulation
const mockCnpjData: CnpjData = {
  cnpj: "00.000.000/0001-00",
  razao_social: "Empresa de Teste S.A.",
  cnae_fiscal: "6201-5/01",
  cnae_fiscal_descricao: "Desenvolvimento de programas de computador sob encomenda",
  endereco: "Rua da Simulação, 123 - Centro, Cidade Fictícia - SP",
  situacao_cadastral: "ATIVA",
  mcc: "7372", // MCC para serviços de programação
  email_proprietario: "teste@unicopag.com.br",
  telefone_proprietario: "11999998888",
};

export default function IndexPage() {
  const [cnpjInput, setCnpjInput] = useState<string>("");
  const [cnpjData, setCnpjData] = useState<CnpjData | null>(null);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [useMockCnpj, setUseMockCnpj] = useState(false); // New state for mock CNPJ
  const [step, setStep] = useState(1); // 1: CNPJ, 2: Rates, 3: Proposals, 4: Documents, 5: Finalize

  // Step 2: Current Rates
  const [currentRates, setCurrentRates] = useState<IdentifiedRates>({
    debito: 0,
    creditoVista: 0,
    creditoParcelado: 0,
  });
  const [rateSheetFile, setRateSheetFile] = useState<File | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  // Step 3: Proposals
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // Step 4: Documents
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [cnpjCardUrl, setCnpjCardUrl] = useState<string | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentUploadStatus, setDocumentUploadStatus] = useState<{
    contract: "idle" | "uploading" | "success" | "error";
    id: "idle" | "uploading" | "success" | "error";
    selfie: "idle" | "uploading" | "success" | "error";
    cnpjCard: "idle" | "generating" | "success" | "error";
  }>({
    contract: "idle",
    id: "idle",
    selfie: "idle",
    cnpjCard: "idle",
  });

  // Step 5: Finalize
  const [responsibleName, setResponsibleName] = useState("");
  const [responsiblePhone, setResponsiblePhone] = useState("");
  const [responsibleEmail, setResponsibleEmail] = useState("");
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [finalizingProposal, setFinalizingProposal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sendMethod, setSendMethod] = useState<"email" | "whatsapp" | null>(null);

  const handleCnpjSearch = async () => {
    if (useMockCnpj) {
      // Use mock data if checkbox is checked
      setCnpjData(mockCnpjData);
      setResponsibleName(mockCnpjData.razao_social);
      setResponsibleEmail(mockCnpjData.email_proprietario);
      setResponsiblePhone(mockCnpjData.telefone_proprietario);
      toast.success("Dados de CNPJ simulados carregados!", { id: "cnpj-fetch" });
      setStep(2);
      return;
    }

    if (!cnpjInput || cnpjInput.replace(/\D/g, "").length !== 14) {
      toast.error("Por favor, insira um CNPJ válido com 14 dígitos.");
      return;
    }
    setLoadingCnpj(true);
    const data = await fetchCnpjData(cnpjInput.replace(/\D/g, ""));
    setLoadingCnpj(false);
    if (data) {
      setCnpjData(data);
      setResponsibleName(data.razao_social); // Pre-fill responsible name with company name
      setResponsibleEmail(data.email_proprietario); // Pre-fill with owner email
      setResponsiblePhone(data.telefone_proprietario); // Pre-fill with owner phone
      setStep(2); // Move to next step
    }
  };

  const handleRateSheetUpload = async () => {
    if (!rateSheetFile) {
      toast.error("Por favor, selecione um arquivo de planilha para análise.");
      return;
    }
    setLoadingRates(true);
    const rates = await uploadRateSheetForAIProcessing(rateSheetFile);
    setLoadingRates(false);
    if (rates) {
      setCurrentRates(rates);
      toast.success("Taxas identificadas com sucesso!");
      setStep(3); // Move to next step
    }
  };

  const handleGenerateProposals = async () => {
    if (!cnpjData?.mcc || !currentRates.debito) {
      toast.error("Dados de CNPJ ou taxas atuais incompletos para gerar propostas.");
      return;
    }
    setLoadingProposals(true);
    const generated = await generateProposals(cnpjData.mcc, currentRates);
    setLoadingProposals(false);
    if (generated) {
      setProposals(generated);
      setStep(3); // Stay on step 3 to select a proposal
    }
  };

  const handleDocumentUpload = async () => {
    if (!cnpjData) {
      toast.error("Dados do CNPJ não carregados.");
      return;
    }

    const filesToUpload = [
      { file: contractFile, type: "Contrato Social", stateKey: "contract" },
      { file: idFile, type: "RG/CNH", stateKey: "id" },
      { file: selfieFile, type: "Selfie", stateKey: "selfie" },
    ];

    let allUploadsSuccessful = true;
    setLoadingDocuments(true);
    setUploadProgress(0);

    for (let i = 0; i < filesToUpload.length; i++) {
      const { file, type, stateKey } = filesToUpload[i];
      if (file) {
        setDocumentUploadStatus((prev) => ({ ...prev, [stateKey]: "uploading" }));
        const url = await uploadDocument(cnpjData.cnpj, file, type);
        if (url) {
          setDocumentUploadStatus((prev) => ({ ...prev, [stateKey]: "success" }));
        } else {
          setDocumentUploadStatus((prev) => ({ ...prev, [stateKey]: "error" }));
          allUploadsSuccessful = false;
        }
      } else {
        setDocumentUploadStatus((prev) => ({ ...prev, [stateKey]: "idle" })); // No file to upload
      }
      setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
    }

    // Generate CNPJ Card
    setDocumentUploadStatus((prev) => ({ ...prev, cnpjCard: "generating" }));
    const cardUrl = await generateCnpjCard(cnpjData.cnpj);
    if (cardUrl) {
      setCnpjCardUrl(cardUrl);
      setDocumentUploadStatus((prev) => ({ ...prev, cnpjCard: "success" }));
    } else {
      setDocumentUploadStatus((prev) => ({ ...prev, cnpjCard: "error" }));
      allUploadsSuccessful = false;
    }

    setLoadingDocuments(false);
    if (allUploadsSuccessful) {
      toast.success("Todos os documentos foram processados com sucesso!");
      setStep(5); // Move to finalize step
    } else {
      toast.error("Ocorreram erros no processamento de alguns documentos.");
    }
  };

  const handleFinalizeProposal = async () => {
    if (!cnpjData || !selectedProposal || !responsibleName || !responsiblePhone || !responsibleEmail || !confirmationChecked) {
      toast.error("Por favor, preencha todos os campos e confirme os dados.");
      return;
    }

    setFinalizingProposal(true);
    const success = await saveAcceptedProposal(cnpjData, currentRates, selectedProposal);
    setFinalizingProposal(false);

    if (success) {
      setShowSuccessDialog(true);
    } else {
      toast.error("Erro ao finalizar a proposta. Tente novamente.");
    }
  };

  const handleSendProposal = async () => {
    if (!cnpjData || !selectedProposal || !currentRates) {
      toast.error("Dados incompletos para enviar a proposta.");
      return;
    }

    let success = false;
    if (sendMethod === "email" && responsibleEmail) {
      success = await sendProposalByEmail(responsibleEmail, cnpjData, currentRates, selectedProposal);
    } else if (sendMethod === "whatsapp" && responsiblePhone) {
      success = await sendProposalByWhatsapp(responsiblePhone, cnpjData, currentRates, selectedProposal);
    }

    if (success) {
      toast.success(`Proposta enviada com sucesso por ${sendMethod === "email" ? "e-mail" : "WhatsApp"}!`);
      setShowSuccessDialog(false); // Close dialog after sending
      resetForm();
    } else {
      toast.error(`Erro ao enviar proposta por ${sendMethod === "email" ? "e-mail" : "WhatsApp"}.`);
    }
  };

  const resetForm = () => {
    setCnpjInput("");
    setCnpjData(null);
    setCurrentRates({ debito: 0, creditoVista: 0, creditoParcelado: 0 });
    setRateSheetFile(null);
    setProposals([]);
    setSelectedProposal(null);
    setContractFile(null);
    setIdFile(null);
    setSelfieFile(null);
    setCnpjCardUrl(null);
    setDocumentUploadStatus({
      contract: "idle",
      id: "idle",
      selfie: "idle",
      cnpjCard: "idle",
    });
    setResponsibleName("");
    setResponsiblePhone("");
    setResponsibleEmail("");
    setConfirmationChecked(false);
    setStep(1);
    setSendMethod(null);
  };

  const getStatusIcon = (status: "idle" | "uploading" | "success" | "error" | "generating") => {
    switch (status) {
      case "uploading":
      case "generating":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-gray-500" />;
    }
  };

  const isNextButtonDisabled = useMemo(() => {
    if (step === 1 && (!useMockCnpj && (!cnpjInput || cnpjInput.replace(/\D/g, "").length !== 14))) return true;
    if (step === 2 && (!rateSheetFile && (currentRates.debito === 0 || currentRates.creditoVista === 0 || currentRates.creditoParcelado === 0))) return true;
    if (step === 3 && !selectedProposal) return true;
    if (step === 4 && (!contractFile || !idFile || !selfieFile)) return true; // All documents required
    if (step === 5 && (!responsibleName || !responsiblePhone || !responsibleEmail || !confirmationChecked)) return true;
    return false;
  }, [step, cnpjInput, useMockCnpj, rateSheetFile, currentRates, selectedProposal, contractFile, idFile, selfieFile, responsibleName, responsiblePhone, responsibleEmail, confirmationChecked]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-unicopag-blue to-unicopag-dark-blue p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg">
        <CardHeader className="bg-unicopag-light-gray p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-unicopag-dark-blue">
            Gerador de Propostas Unicopag
          </CardTitle>
          <CardDescription className="text-unicopag-gray-text mt-2">
            Acompanhe o progresso da sua proposta: Etapa {step} de 5
          </CardDescription>
          <Progress value={(step / 5) * 100} className="w-full mt-4" />
        </CardHeader>

        {/* Step 1: CNPJ Input */}
        {step === 1 && (
          <CardContent className="space-y-4 p-6">
            <Label htmlFor="cnpj">CNPJ do Cliente</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0001-00"
              value={formatCnpj(cnpjInput)}
              onChange={(e) => setCnpjInput(e.target.value)}
              maxLength={18}
              disabled={loadingCnpj || useMockCnpj}
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="use-mock-cnpj"
                checked={useMockCnpj}
                onCheckedChange={(checked) => setUseMockCnpj(!!checked)}
                disabled={loadingCnpj}
              />
              <label
                htmlFor="use-mock-cnpj"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Usar dados de CNPJ simulados
              </label>
            </div>
            <Button onClick={handleCnpjSearch} disabled={loadingCnpj || (!useMockCnpj && (!cnpjInput || cnpjInput.replace(/\D/g, "").length !== 14))}>
              {loadingCnpj ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Buscando...
                </>
              ) : (
                "Buscar CNPJ"
              )}
            </Button>

            {cnpjData && (
              <div className="mt-4 p-4 border rounded-md bg-unicopag-light-gray">
                <h3 className="font-semibold text-lg mb-2">Dados do CNPJ:</h3>
                <p>
                  <strong>Razão Social:</strong> {cnpjData.razao_social}
                </p>
                <p>
                  <strong>CNAE:</strong> {cnpjData.cnae_fiscal_descricao}
                </p>
                <p>
                  <strong>Endereço:</strong> {cnpjData.endereco}
                </p>
                <p>
                  <strong>Situação Cadastral:</strong> {cnpjData.situacao_cadastral}
                </p>
                <p>
                  <strong>MCC Sugerido:</strong> {cnpjData.mcc}
                </p>
              </div>
            )}
          </CardContent>
        )}

        {/* Step 2: Current Rates */}
        {step === 2 && (
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-unicopag-dark-blue">
              2. Taxas Atuais do Cliente
            </h2>
            <CardDescription>
              Insira as taxas atuais do cliente manualmente ou faça upload de uma planilha para análise por IA.
            </CardDescription>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rate-sheet">Upload de Planilha (IA)</Label>
                <Input
                  id="rate-sheet"
                  type="file"
                  accept=".csv,.xlsx,.pdf"
                  onChange={(e) => setRateSheetFile(e.target.files ? e.target.files[0] : null)}
                  disabled={loadingRates}
                />
                <Button onClick={handleRateSheetUpload} className="mt-2 w-full" disabled={loadingRates || !rateSheetFile}>
                  {loadingRates ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analisando...
                    </>
                  ) : (
                    "Analisar Planilha com IA"
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Ou Insira Manualmente</Label>
                <div>
                  <Label htmlFor="debito">Débito (%)</Label>
                  <Input
                    id="debito"
                    type="number"
                    step="0.01"
                    value={currentRates.debito === 0 ? "" : currentRates.debito}
                    onChange={(e) =>
                      setCurrentRates({ ...currentRates, debito: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Ex: 1.50"
                  />
                </div>
                <div>
                  <Label htmlFor="credito-vista">Crédito à Vista (%)</Label>
                  <Input
                    id="credito-vista"
                    type="number"
                    step="0.01"
                    value={currentRates.creditoVista === 0 ? "" : currentRates.creditoVista}
                    onChange={(e) =>
                      setCurrentRates({ ...currentRates, creditoVista: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Ex: 2.00"
                  />
                </div>
                <div>
                  <Label htmlFor="credito-parcelado">Crédito Parcelado (%)</Label>
                  <Input
                    id="credito-parcelado"
                    type="number"
                    step="0.01"
                    value={currentRates.creditoParcelado === 0 ? "" : currentRates.creditoParcelado}
                    onChange={(e) =>
                      setCurrentRates({ ...currentRates, creditoParcelado: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Ex: 3.50"
                  />
                </div>
              </div>
            </div>

            {currentRates.debito > 0 && (
              <div className="mt-4 p-4 border rounded-md bg-unicopag-light-gray">
                <h3 className="font-semibold text-lg mb-2">Taxas Atuais Identificadas:</h3>
                <p>
                  <strong>Débito:</strong> {currentRates.debito.toFixed(2)}%
                </p>
                <p>
                  <strong>Crédito à Vista:</strong> {currentRates.creditoVista.toFixed(2)}%
                </p>
                <p>
                  <strong>Crédito Parcelado:</strong> {currentRates.creditoParcelado.toFixed(2)}%
                </p>
              </div>
            )}
          </CardContent>
        )}

        {/* Step 3: Proposals */}
        {step === 3 && (
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-unicopag-dark-blue">
              3. Gerar e Selecionar Proposta
            </h2>
            <CardDescription>
              Gere as propostas com base nas taxas atuais e selecione a melhor opção para o cliente.
            </CardDescription>

            <Button onClick={handleGenerateProposals} disabled={loadingProposals || !cnpjData || !currentRates.debito}>
              {loadingProposals ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                </>
              ) : (
                "Gerar Propostas"
              )}
            </Button>

            {proposals.length > 0 && (
              <div className="space-y-4 mt-4">
                <Label>Selecione uma Proposta:</Label>
                {proposals.map((proposal) => (
                  <div
                    key={proposal.type}
                    className={`p-4 border rounded-md cursor-pointer transition-all ${
                      selectedProposal?.type === proposal.type
                        ? "border-unicopag-blue ring-2 ring-unicopag-blue bg-unicopag-light-gray"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <h3 className="font-semibold text-lg">{proposal.type}</h3>
                    <p className="text-sm text-gray-600">{proposal.description}</p>
                    <div className="mt-2 text-sm">
                      <p>
                        <strong>Débito:</strong> {proposal.taxa_debito.toFixed(2)}%
                      </p>
                      <p>
                        <strong>Crédito à Vista:</strong> {proposal.taxa_credito_vista.toFixed(2)}%
                      </p>
                      <p>
                        <strong>Crédito Parcelado:</strong> {proposal.taxa_credito_parcelado.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedProposal && (
              <div className="p-4 border rounded-md bg-unicopag-light-gray mt-4">
                <h3 className="font-semibold text-lg mb-2">Proposta Selecionada: {selectedProposal.type}</h3>
                <p>
                  <strong>Débito:</strong> {selectedProposal.taxa_debito.toFixed(2)}%
                </p>
                <p>
                  <strong>Crédito à Vista:</strong> {selectedProposal.taxa_credito_vista.toFixed(2)}%
                </p>
                <p>
                  <strong>Crédito Parcelado:</strong> {selectedProposal.taxa_credito_parcelado.toFixed(2)}%
                </p>
              </div>
            )}
          </CardContent>
        )}

        {/* Step 4: Document Upload */}
        {step === 4 && (
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-unicopag-dark-blue">
              4. Upload de Documentos
            </h2>
            <CardDescription>
              Faça o upload dos documentos necessários e gere o Cartão CNPJ.
            </CardDescription>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract-file">Contrato Social</Label>
                <Input
                  id="contract-file"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setContractFile(e.target.files ? e.target.files[0] : null)}
                  disabled={loadingDocuments}
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getStatusIcon(documentUploadStatus.contract)}
                  {documentUploadStatus.contract === "uploading" && "Enviando Contrato Social..."}
                  {documentUploadStatus.contract === "success" && "Contrato Social enviado."}
                  {documentUploadStatus.contract === "error" && "Erro ao enviar Contrato Social."}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-file">RG/CNH do Proprietário</Label>
                <Input
                  id="id-file"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setIdFile(e.target.files ? e.target.files[0] : null)}
                  disabled={loadingDocuments}
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getStatusIcon(documentUploadStatus.id)}
                  {documentUploadStatus.id === "uploading" && "Enviando RG/CNH..."}
                  {documentUploadStatus.id === "success" && "RG/CNH enviado."}
                  {documentUploadStatus.id === "error" && "Erro ao enviar RG/CNH."}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="selfie-file">Selfie do Proprietário</Label>
                <Input
                  id="selfie-file"
                  type="file"
                  accept=".jpg,.png"
                  onChange={(e) => setSelfieFile(e.target.files ? e.target.files[0] : null)}
                  disabled={loadingDocuments}
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getStatusIcon(documentUploadStatus.selfie)}
                  {documentUploadStatus.selfie === "uploading" && "Enviando Selfie..."}
                  {documentUploadStatus.selfie === "success" && "Selfie enviada."}
                  {documentUploadStatus.selfie === "error" && "Erro ao enviar Selfie."}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cartão CNPJ</Label>
                <Button
                  onClick={handleDocumentUpload}
                  className="w-full"
                  disabled={loadingDocuments || !cnpjData || !contractFile || !idFile || !selfieFile}
                >
                  {loadingDocuments ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando Documentos...
                    </>
                  ) : (
                    "Processar Documentos e Gerar Cartão CNPJ"
                  )}
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getStatusIcon(documentUploadStatus.cnpjCard)}
                  {documentUploadStatus.cnpjCard === "generating" && "Gerando Cartão CNPJ..."}
                  {documentUploadStatus.cnpjCard === "success" && (
                    <a href={cnpjCardUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      <FileText className="h-4 w-4 mr-1" /> Cartão CNPJ Gerado
                    </a>
                  )}
                  {documentUploadStatus.cnpjCard === "error" && "Erro ao gerar Cartão CNPJ."}
                </div>
              </div>
            </div>
            {loadingDocuments && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-center text-sm mt-1">{uploadProgress}% Concluído</p>
              </div>
            )}
          </CardContent>
        )}

        {/* Step 5: Finalize Proposal */}
        {step === 5 && (
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-unicopag-dark-blue">
              5. Finalizar Proposta
            </h2>
            <CardDescription>
              Confirme os dados do responsável e finalize a proposta.
            </CardDescription>

            <div className="space-y-2">
              <Label htmlFor="responsible-name">Nome do Responsável</Label>
              <Input
                id="responsible-name"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                placeholder="Nome Completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible-phone">Telefone do Responsável</Label>
              <Input
                id="responsible-phone"
                value={formatPhone(responsiblePhone)}
                onChange={(e) => setResponsiblePhone(e.target.value)}
                placeholder="(DD) 99999-9999"
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible-email">E-mail do Responsável</Label>
              <Input
                id="responsible-email"
                type="email"
                value={responsibleEmail}
                onChange={(e) => setResponsibleEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="confirmation"
                checked={confirmationChecked}
                onCheckedChange={(checked) => setConfirmationChecked(!!checked)}
              />
              <label
                htmlFor="confirmation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tive atenção de conferir que nome e telefone para não perder tempo.
              </label>
            </div>

            <Button onClick={handleFinalizeProposal} className="w-full mt-4" disabled={finalizingProposal || isNextButtonDisabled}>
              {finalizingProposal ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizando...
                </>
              ) : (
                "Finalizar Proposta"
              )}
            </Button>
          </CardContent>
        )}

        <CardFooter className="flex justify-between p-6 bg-unicopag-light-gray rounded-b-lg">
          <Button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
            Anterior
          </Button>
          {step < 5 && (
            <Button onClick={() => setStep(step + 1)} disabled={isNextButtonDisabled}>
              Próximo
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-unicopag-dark-blue">Proposta Finalizada!</DialogTitle>
            <DialogDescription>
              A proposta foi salva com sucesso. Agora você pode enviá-la ao cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-unicopag-blue" />
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSendMethod("email");
                  handleSendProposal();
                }}
                disabled={!responsibleEmail}
              >
                Enviar por E-mail
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-unicopag-blue" />
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSendMethod("whatsapp");
                  handleSendProposal();
                }}
                disabled={!responsiblePhone}
              >
                Enviar por WhatsApp
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={resetForm}>
              Nova Proposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}