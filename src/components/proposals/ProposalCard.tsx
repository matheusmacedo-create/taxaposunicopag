import { useState, useMemo } from "react";
import { Proposal } from "@/api/unicopag-api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalCardProps {
  proposal: Proposal;
  onSelect: (proposal: Proposal) => void;
  isSelected: boolean;
}

export const ProposalCard = ({ proposal, onSelect, isSelected }: ProposalCardProps) => {
  const [transactionValue, setTransactionValue] = useState<string>("");

  const getCardClass = () => {
    switch (proposal.type) {
      case "Combate":
        return "border-unicopag-red";
      case "Equilibrada":
        return "border-blue-500";
      case "Padrao":
        return "border-green-500";
      default:
        return "";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculationResults = useMemo(() => {
    const value = parseFloat(transactionValue);
    if (isNaN(value) || value <= 0) {
      return null;
    }

    // Debit calculation
    const debitFeeAmount = value * (proposal.taxa_debito / 100);
    const debitNetAmount = value - debitFeeAmount;

    // Credit à Vista calculation
    const creditVistaFeeAmount = value * (proposal.taxa_credito_vista / 100);
    const creditVistaNetAmount = value - creditVistaFeeAmount;

    // Credit Parcelado calculation (assuming taxa_credito_parcelado is the total fee for up to 12x)
    const creditParceladoFeeAmount = value * (proposal.taxa_credito_parcelado / 100);
    const creditParceladoNetAmount = value - creditParceladoFeeAmount;

    const installments = [];
    for (let i = 2; i <= 12; i++) {
      installments.push({
        count: i,
        value: creditParceladoNetAmount / i,
      });
    }

    return {
      debitFeeAmount,
      debitNetAmount,
      creditVistaFeeAmount,
      creditVistaNetAmount,
      creditParceladoFeeAmount,
      creditParceladoNetAmount,
      installments,
    };
  }, [transactionValue, proposal]);

  return (
    <Card
      className={cn(
        "relative transition-all duration-200",
        getCardClass(),
        isSelected ? "ring-2 ring-offset-2 ring-unicopag-red" : "hover:shadow-md"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {proposal.type}
          {isSelected && <CheckCircle className="h-5 w-5 text-unicopag-red" />}
        </CardTitle>
        <CardDescription>{proposal.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Débito:</strong> {proposal.taxa_debito.toFixed(2)}%</p>
        <p><strong>Crédito à Vista:</strong> {proposal.taxa_credito_vista.toFixed(2)}%</p>
        <p><strong>Crédito Parcelado:</strong> {proposal.taxa_credito_parcelado.toFixed(2)}%</p>

        <div className="pt-4 border-t mt-4">
          <h4 className="font-semibold mb-2 text-unicopag-black">Simulador de Taxas</h4>
          <Label htmlFor={`transaction-value-${proposal.type}`} className="sr-only">Valor da Transação</Label>
          <Input
            id={`transaction-value-${proposal.type}`}
            type="text"
            placeholder="Valor da Transação (R$)"
            value={transactionValue}
            onChange={(e) => {
              let value = e.target.value;
              // Allow only digits, comma, and dot
              value = value.replace(/[^0-9,.]/g, '');

              // Replace comma with dot for consistent parsing
              value = value.replace(/,/g, '.');

              // Ensure only one dot for decimal
              const parts = value.split('.');
              if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
              }

              setTransactionValue(value);
            }}
            className="mb-4"
          />

          {calculationResults && (
            <div className="space-y-3 text-xs">
              <p className="font-bold">Valor Bruto: {formatCurrency(parseFloat(transactionValue))}</p>

              <div className="border-t pt-2">
                <p className="font-semibold">Débito:</p>
                <p>Taxa: {formatCurrency(calculationResults.debitFeeAmount)}</p>
                <p>Líquido: {formatCurrency(calculationResults.debitNetAmount)}</p>
              </div>

              <div className="border-t pt-2">
                <p className="font-semibold">Crédito à Vista:</p>
                <p>Taxa: {formatCurrency(calculationResults.creditVistaFeeAmount)}</p>
                <p>Líquido: {formatCurrency(calculationResults.creditVistaNetAmount)}</p>
              </div>

              <div className="border-t pt-2">
                <p className="font-semibold">Crédito Parcelado:</p>
                <p>Taxa: {formatCurrency(calculationResults.creditParceladoFeeAmount)}</p>
                <p>Líquido: {formatCurrency(calculationResults.creditParceladoNetAmount)}</p>
                <p className="font-semibold mt-2">Parcelas (Líquido):</p>
                <ul className="list-disc pl-5">
                  {calculationResults.installments.map((inst) => (
                    <li key={inst.count}>{inst.count}x de {formatCurrency(inst.value)}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onSelect(proposal)}
          className="w-full"
          variant={isSelected ? "secondary" : "default"}
        >
          {isSelected ? "Proposta Selecionada" : "Selecionar Proposta"}
        </Button>
      </CardFooter>
    </Card>
  );
};