"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Icon, LoadingIcon } from "@/components/ui/icon";
import { fetchProposalDetail, ProposalDetail } from "@/api/unicopag-api";
import { toast } from "sonner";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { variant: "secondary" as const, label: "Pendente" },
    accepted: { variant: "default" as const, label: "Aceita" },
    rejected: { variant: "destructive" as const, label: "Rejeitada" },
    sent: { variant: "outline" as const, label: "Enviada" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function ProposalViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<ProposalDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProposal = async () => {
      if (!id) {
        toast.error("ID da proposta não fornecido.");
        navigate("/dashboard");
        return;
      }

      setLoading(true);
      const proposalData = await fetchProposalDetail(id);
      setLoading(false);

      if (!proposalData) {
        toast.error("Proposta não encontrada.");
        navigate("/dashboard");
        return;
      }

      setProposal(proposalData);
    };

    loadProposal();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-unicopag-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8 text-center">
            <LoadingIcon className="h-8 w-8 mx-auto mb-4" />
            <p className="text-unicopag-gray-text">Carregando detalhes da proposta...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-unicopag-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-8 text-center">
            <Icon name="xCircle" className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Proposta não encontrada</h2>
            <p className="text-unicopag-gray-text mb-4">
              A proposta solicitada não foi encontrada ou não existe.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-unicopag-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-unicopag-dark-blue">
              Visualização de Proposta
            </h1>
            <p className="text-unicopag-gray-text mt-1">
              Detalhes completos da proposta #{proposal.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(proposal.status)}
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <Icon name="chevronLeft" className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="cnpj" className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">CNPJ</Label>
                <p className="font-mono">{proposal.cnpjData.cnpj}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">Razão Social</Label>
                <p className="font-semibold">{proposal.cnpjData.razao_social}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">CNAE</Label>
                <p className="text-sm">{proposal.cnpjData.cnae_fiscal_descricao}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">Endereço</Label>
                <p className="text-sm">{proposal.cnpjData.endereco}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">Situação</Label>
                <Badge variant="outline">{proposal.cnpjData.situacao_cadastral}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Taxas Atuais vs Proposta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="dollarSign" className="h-5 w-5" />
                Comparação de Taxas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Taxas Atuais</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Débito:</span>
                    <span className="font-mono">{proposal.currentRates.debito.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédito à Vista:</span>
                    <span className="font-mono">{proposal.currentRates.creditoVista.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédito Parcelado:</span>
                    <span className="font-mono">{proposal.currentRates.creditoParcelado.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Proposta UnicoPag</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Débito:</span>
                    <span className="font-mono text-green-600">{proposal.selectedProposal.taxa_debito.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédito à Vista:</span>
                    <span className="font-mono text-green-600">{proposal.selectedProposal.taxa_credito_vista.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédito Parcelado:</span>
                    <span className="font-mono text-green-600">{proposal.selectedProposal.taxa_credito_parcelado.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Economia Estimada</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Débito:</span>
                    <span className="font-mono text-green-600">
                      -{((proposal.currentRates.debito - proposal.selectedProposal.taxa_debito) / proposal.currentRates.debito * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédito à Vista:</span>
                    <span className="font-mono text-green-600">
                      -{((proposal.currentRates.creditoVista - proposal.selectedProposal.taxa_credito_vista) / proposal.currentRates.creditoVista * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédito Parcelado:</span>
                    <span className="font-mono text-green-600">
                      -{((proposal.currentRates.creditoParcelado - proposal.selectedProposal.taxa_credito_parcelado) / proposal.currentRates.creditoParcelado * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Responsável */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="user" className="h-5 w-5" />
                Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">Nome</Label>
                <p className="font-semibold">{proposal.responsibleName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">Telefone</Label>
                <p className="font-mono">{proposal.responsiblePhone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-unicopag-gray-text">E-mail</Label>
                <p className="font-mono text-sm">{proposal.responsibleEmail}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes da Proposta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="fileText" className="h-5 w-5" />
              Detalhes da Proposta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Tipo de Proposta</h4>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {proposal.selectedProposal.type}
                </Badge>
                <p className="text-sm text-unicopag-gray-text mt-2">
                  {proposal.selectedProposal.description}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Datas</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-unicopag-gray-text">Criada em:</span>
                    <p className="font-mono">{formatDate(proposal.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-unicopag-gray-text">Atualizada em:</span>
                    <p className="font-mono">{formatDate(proposal.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="upload" className="h-5 w-5" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {proposal.documents.contractUrl && (
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Icon name="fileText" className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Contrato Social</p>
                    <a 
                      href={proposal.documents.contractUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Visualizar
                    </a>
                  </div>
                </div>
              )}
              
              {proposal.documents.idUrl && (
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Icon name="fileText" className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">RG/CNH</p>
                    <a 
                      href={proposal.documents.idUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Visualizar
                    </a>
                  </div>
                </div>
              )}
              
              {proposal.documents.selfieUrl && (
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Icon name="fileText" className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Selfie</p>
                    <a 
                      href={proposal.documents.selfieUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Visualizar
                    </a>
                  </div>
                </div>
              )}
              
              {proposal.documents.cnpjCardUrl && (
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Icon name="cnpj" className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cartão CNPJ</p>
                    <a 
                      href={proposal.documents.cnpjCardUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Visualizar
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Icon name="email" className="h-4 w-4 mr-2" />
                Reenviar por E-mail
              </Button>
              <Button variant="outline">
                <Icon name="whatsapp" className="h-4 w-4 mr-2" />
                Reenviar por WhatsApp
              </Button>
              <Button variant="outline">
                <Icon name="fileText" className="h-4 w-4 mr-2" />
                Gerar PDF
              </Button>
              <Button variant="outline">
                <Icon name="messageSquare" className="h-4 w-4 mr-2" />
                Adicionar Observação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
