import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp } from "lucide-react";
import { fetchDashboardMetrics, Metrics } from "@/api/unicopag-api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const MetricsDisplay = () => {
  const { data: metrics, isLoading, isError }: UseQueryResult<Metrics | null, Error> = useQuery<Metrics | null, Error>({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Geradas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Aceitas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média Aceita</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !metrics) {
    return <div className="text-center text-red-500">Erro ao carregar métricas do dashboard.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Propostas Geradas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalProposals}</div>
          <p className="text-xs text-muted-foreground">Total de propostas criadas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Propostas Aceitas</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.acceptedProposals}</div>
          <p className="text-xs text-muted-foreground">Propostas que viraram negócio</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Margem Média Aceita</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageAcceptedMargin.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">Margem média das propostas aceitas</p>
        </CardContent>
      </Card>
    </div>
  );
};