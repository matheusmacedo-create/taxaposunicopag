import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { CnpjForm } from "@/components/cnpj/CnpjForm";
import { ClientDetails } from "@/components/cnpj/ClientDetails";
import { ProposalGenerator } from "@/components/proposals/ProposalGenerator";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { CnpjCardGenerator } from "@/components/documents/CnpjCardGenerator";
import { CnpjData, Proposal, saveAcceptedProposal } from "@/api/unicopag-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [cnpjData, setCnpjData] = useState<CnpjData | null>(null);
  const [currentRates, setCurrentRates] = useState<{ debito: number; creditoVista: number; creditoParcelado: number } | null>(null);
  const [generatedProposals, setGeneratedProposals] = useState<Proposal[] | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [documentsUploaded, setDocumentsUploaded] = useState<boolean>(false);
  const [cnpjCardGenerated, setCnpjCardGenerated] = useState<boolean>(false);
  const [step, setStep] = useState(1);

  const handleCnpjDataFetched = (data: CnpjData) => {
    setCnpjData(data);
    setStep(2);
  };

  const handleProposalsGenerated = (rates: { debito: number; creditoVista: number; creditoParcelado: number }, proposals: Proposal[]) => {
    setCurrentRates(rates);
    setGeneratedProposals(proposals);
    setStep(3);
  };

  const handleProposalSelected = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setStep(4);
  };

  const handleDocumentsUploaded = () => {
    setDocumentsUploaded(true);
    setStep(5);
  };

  const handleCnpjCardGenerated = () => {
    setCnpjCardGenerated(true);
    setStep(6);
  };

  const handleSaveProposal = async () => {
    if (cnpjData && currentRates && selectedProposal) {
      const success = await saveAcceptedProposal(cnpjData, currentRates, selectedProposal);
      if (success) {
        toast.success("Proposta e documentos finalizados e salvos!");
        setStep(7); // Final step
      } else {
        toast.error("Falha ao finalizar e salvar a proposta.");
      }
    } else {
      toast.error("Dados incompletos para salvar a proposta.");
    }
  };

  const resetFlow = () => {
    setCnpjData(null);
    setCurrentRates(null);
    setGeneratedProposals(null);
    setSelectedProposal(null);
    setDocumentsUploaded(false);
    setCnpjCardGenerated(false);
    setStep(1);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-unicopag-black text-center mb-8">UnicoPag PoS - Gestão de Taxas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: CNPJ Lookup */}
        <Card className={step >= 1 ? "" : "opacity-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-unicopag-red text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
              Consulta de CNPJ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CnpjForm onCnpjDataFetched={handleCnpjDataFetched} />
            {cnpjData && <ClientDetails cnpjData={cnpjData} />}
          </CardContent>
        </Card>

        {/* Step 2 & 3: Proposal Generation */}
        <Card className={step >= 2 ? "" : "opacity-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-unicopag-red text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
              Geração de Propostas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cnpjData && (
              <ProposalGenerator
                mcc={cnpjData.mcc}
                onProposalsGenerated={handleProposalsGenerated}
                onProposalSelected={handleProposalSelected}
                generatedProposals={generatedProposals}
                selectedProposal={selectedProposal}
                disabled={step < 2}
              />
            )}
          </CardContent>
        </Card>

        {/* Step 4 & 5 & 6: Document Upload & Finalization */}
        <Card className={step >= 4 ? "" : "opacity-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 4 ? 'bg-unicopag-red text-white' : 'bg-gray-200 text-gray-500'}`}>3</span>
              Documentos e Finalização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProposal && (
              <div className="p-4 border rounded-md bg-unicopag-light-gray">
                <h3 className="font-semibold text-lg mb-2">Proposta Selecionada: {selectedProposal.type}</h3>
                <p>Débito: {selectedProposal.taxa_debito}%</p>
                <p>Crédito à Vista: {selectedProposal.taxa_credito_vista}%</p>
                <p>Crédito Parcelado: {selectedProposal.taxa_credito_parcelado}%</p>
              </div>
            )}
            {cnpjData && (
              <>
                <DocumentUploader
                  cnpj={cnpjData.cnpj}
                  isPJ={true} // Assuming CNPJ means PJ
                  onUploadComplete={handleDocumentsUploaded}
                  disabled={step < 4}
                />
                <CnpjCardGenerator
                  cnpj={cnpjData.cnpj}
                  onCnpjCardGenerated={handleCnpjCardGenerated}
                  disabled={step < 5}
                />
              </>
            )}
            <Button
              onClick={handleSaveProposal}
              className="w-full bg-unicopag-red hover:bg-unicopag-red/90 text-white"
              disabled={step < 6 || !documentsUploaded || !cnpjCardGenerated}
            >
              Finalizar e Salvar Proposta
            </Button>
            {step === 7 && (
              <Button onClick={resetFlow} variant="outline" className="w-full mt-4">
                Iniciar Nova Proposta
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;