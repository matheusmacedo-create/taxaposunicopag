import React from "react";
import { CnpjData } from "@/api/unicopag-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientDetailsProps {
  cnpjData: CnpjData;
}

export const ClientDetails = ({ cnpjData }: ClientDetailsProps) => {
  return (
    <Card className="mt-6 bg-unicopag-light-gray border-unicopag-red/20">
      <CardHeader>
        <CardTitle className="text-lg text-unicopag-black">Dados do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Razão Social:</strong> {cnpjData.razao_social}</p>
        <p><strong>CNPJ:</strong> {cnpjData.cnpj}</p>
        <p><strong>CNAE Principal:</strong> {cnpjData.cnae_fiscal} - {cnpjData.cnae_fiscal_descricao}</p>
        <p><strong>MCC Mapeado:</strong> {cnpjData.mcc}</p>
        <p><strong>Endereço:</strong> {cnpjData.endereco}</p>
        <p><strong>Situação Cadastral:</strong> {cnpjData.situacao_cadastral}</p>
      </CardContent>
    </Card>
  );
};