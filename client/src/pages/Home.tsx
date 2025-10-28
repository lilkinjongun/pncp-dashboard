import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Calendar, AlertCircle } from "lucide-react";

interface Stats {
  total_contratacoes: number;
  valor_total_estimado: number;
  ultima_atualizacao: string;
  por_modalidade: Array<{ modalidade_nome: string; quantidade: number }>;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/stats`);
        if (!response.ok) throw new Error('Erro ao carregar dados');
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitor de Contratações Públicas</h1>
          </div>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">⚠️ Erro ao conectar à API: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">Verifique se o servidor backend está rodando.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Monitor de Contratações Públicas
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe em tempo real as contratações do município de Santo Antônio de Pádua - RJ
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Contratações
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">{stats?.total_contratacoes || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Registradas no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total Estimado
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-32 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.valor_total_estimado || 0)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Soma de todas as contratações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Última Atualização
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.ultima_atualizacao ? new Date(stats.ultima_atualizacao).toLocaleDateString('pt-BR') : '-'}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Dados atualizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Modalidades
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-12 animate-pulse rounded bg-muted" />
              ) : (
                <div className="text-2xl font-bold">{stats?.por_modalidade?.length || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Tipos de licitação
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
            <CardDescription>
              Monitoramento automatizado de contratações públicas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">O que é o PNCP?</h3>
              <p className="text-sm text-muted-foreground">
                O Portal Nacional de Contratações Públicas (PNCP) é o ambiente único e oficial onde ficam
                centralizadas as informações sobre todas as contratações públicas no Brasil — da União, estados e municípios.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Funcionalidades do Sistema</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Monitoramento automático diário de novas contratações</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Visualização detalhada de todas as modalidades de licitação</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Estatísticas e gráficos de análise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Notificações por e-mail de novas contratações</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

