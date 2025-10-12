import React from "react";
import { Proposal } from "@/api/unicopag-api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalCardProps {
  proposal: Proposal;
  onSelect: (proposal: Proposal) => void;
  isSelected: boolean;
}

export const ProposalCard = ({ proposal, onSelect, isSelected }: ProposalCardProps) => {
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