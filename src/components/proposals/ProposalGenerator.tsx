import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateProposals, Proposal } from "@/api/unicopag-api";
import { toast } from "sonner";
import { ProposalCard } from "./ProposalCard";

interface ProposalGeneratorProps {
  mcc: string;
  onProposalsGenerated: (rates: { debito: number; creditoVista: number; creditoParcelado: number }, proposals: Proposal[]) => void;
  onProposalSelected: (proposal: Proposal) => void;
  generatedProposals: Proposal[] | null;
  selectedProposal: Proposal | null;
  disabled: boolean;
}

export const ProposalGenerator = ({
  mcc,
  onProposalsGenerated,
  onProposalSelected,
  generatedProposals,
  selectedProposal,
  disabled,
}: ProposalGeneratorProps) => {
  const [debito, setDebito] = useState<string>("");
  const [creditoVista, setCreditoVista] = useState<string>("");
  const [creditoParcelado, setCreditoParcelado] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateProposals = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDebito = parseFloat(debito);
    const parsedCreditoVista = parseFloat(creditoVista);
    const parsedCreditoParcelado = parseFloat(creditoParcelado);

    if (isNaN(parsedDebito) || isNaN(parsedCreditoVista) || isNaN(parsedCreditoParcelado)) {
      toast.error("Por favor, insira taxas válidas.");
      return;
    }

    setIsLoading(true);
    const rates = {
      debito: parsedDebito,
      creditoVista: parsedCreditoVista,
      creditoParcelado: parsedCreditoParcelado,
    };
    const proposals = await generateProposals(mcc, rates);
    setIsLoading(false);

    if (proposals) {
      onProposalsGenerated(rates, proposals);
    }
  };

  return (
    <div className={`space-y-6 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <form onSubmit={handleGenerateProposals} className="space-y-4">
        <h3 className="text-md font-semibold text-unicopag-black">Taxas Atuais do Cliente</h3>
        <div>
          <Label htmlFor="debito">Débito (%)</Label>
          <Input
            id="debito"
            type="number"
            step="0.01"
            value={debito}
            onChange={(e) => setDebito(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="creditoVista">Crédito à Vista (%)</Label>
          <Input
            id="creditoVista"
            type="number"
            step="0.01"
            value={creditoVista}
            onChange={(e) => setCreditoVista(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="creditoParcelado">Crédito Parcelado (%)</Label>
          <Input
            id="creditoParcelado"
            type="number"
            step="0.01"
            value={creditoParcelado}
            onChange={(e) => setCreditoParcelado(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full bg-unicopag-red hover:bg-unicopag-red/90 text-white" disabled={isLoading}>
          {isLoading ? "Calculando..." : "Gerar Propostas"}
        </Button>
      </form>

      {generatedProposals && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-unicopag-black">Propostas Geradas</h3>
          <div className="grid gap-4 md:grid-cols-1">
            {generatedProposals.map((proposal) => (
              <ProposalCard
                key={proposal.type}
                proposal={proposal}
                onSelect={onProposalSelected}
                isSelected={selectedProposal?.type === proposal.type}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};