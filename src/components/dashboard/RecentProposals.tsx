import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchRecentProposals, RecentProposal } from "@/api/unicopag-api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/ui/icon";

export const RecentProposals = () => {
  const navigate = useNavigate();
  const { data: recentProposals, isLoading, isError }: UseQueryResult<RecentProposal[] | null, Error> = useQuery<RecentProposal[] | null, Error>({
    queryKey: ["recentProposals"],
    queryFn: fetchRecentProposals,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Propostas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CNPJ</TableHead>
                <TableHead>Razão Social</TableHead>
                <TableHead>Tipo de Proposta</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (isError || !recentProposals) {
    return <div className="text-center text-red-500">Erro ao carregar propostas recentes.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propostas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CNPJ</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>Tipo de Proposta</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentProposals.map((proposal: RecentProposal) => ( // Adicionado tipo explícito para 'proposal'
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">{proposal.cnpj}</TableCell>
                <TableCell>{proposal.razao_social}</TableCell>
                <TableCell>{proposal.proposalType}</TableCell>
                <TableCell>{proposal.date}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/proposal/${proposal.id}`)}
                  >
                    <Icon name="search" className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};