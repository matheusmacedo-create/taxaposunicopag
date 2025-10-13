"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Proposal } from "@/api/unicopag-api";

interface ProposalSimulatorProps {
  proposal: Proposal;
}

const ProposalSimulator: React.FC<ProposalSimulatorProps> = ({ proposal }) => {
  const [transactionValue, setTransactionValue] = useState<number | string>("");

  const parsedTransactionValue = useMemo(() => {
    const value = parseFloat(String(transactionValue).replace(",", "."));
    return isNaN(value) ? 0 : value;
  }, [transactionValue]);

  const calculateNetValue = (rate: number) => {
    if (parsedTransactionValue === 0) return 0;
    return parsedTransactionValue * (1 - rate / 100);
  };

  const debitNet = calculateNetValue(proposal.taxa_debito);
  const creditVistaNet = calculateNetValue(proposal.taxa_credito_vista);
  const creditParceladoNet = calculateNetValue(proposal.taxa_credito_parcelado);

  const installments = Array.from({ length: 11 }, (_, i) => i + 2); // 2x to 12x

  return (
    <div className="space-y-4 p-4 border rounded-md bg-unicopag-light-gray mt-4">
      <h3 className="font-semibold text-lg text-unicopag-dark-blue">Simulador de Valores</h3>
      <p className="text-sm text-gray-600">
        Insira um valor de transação para ver o valor líquido recebido pelo lojista.
      </p>

      <div>
        <Label htmlFor="transaction-value">Valor da Transação (R$)</Label>
        <Input
          id="transaction-value"
          type="number"
          step="0.01"
          value={transactionValue}
          onChange={(e) => setTransactionValue(e.target.value)}
          placeholder="Ex: 1000.00"
        />
      </div>

      {parsedTransactionValue > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modalidade</TableHead>
              <TableHead className="text-right">Valor Líquido (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Débito</TableCell>
              <TableCell className="text-right">
                {debitNet.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Crédito à Vista (1x)</TableCell>
              <TableCell className="text-right">
                {creditVistaNet.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </TableCell>
            </TableRow>
            {installments.map((x) => (
              <TableRow key={x}>
                <TableCell>Crédito Parcelado ({x}x)</TableCell>
                <TableCell className="text-right">
                  {creditParceladoNet.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ProposalSimulator;