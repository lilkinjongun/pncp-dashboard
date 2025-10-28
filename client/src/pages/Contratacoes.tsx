import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";

interface Contratacao {
  id: number;
  numero_compra: string;
  ano_compra: number;
  objeto: string;
  valor_estimado: number;
  modalidade_nome: string;
  data_publicacao: string;
  situacao: string;
  link_pncp: string;
}

interface ApiResponse {
  total: number;
  contratacoes: Contratacao[];
}

export default function Contratacoes() {
  const [contratacoes, setContratacoes] = useState<Contratacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarContratacoes();
  }, []);

  const carregarContratacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contratacoes?limite=100`);
      if (!response.ok) throw new Error('Erro ao carregar contratações');
      const data: ApiResponse = await response.json();
      setContratacoes(data.contratacoes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar contratações:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getModalidadeBadgeVariant = (modalidade: string) => {
    if (modalidade.includes('Pregão')) return 'default';
    if (modalidade.includes('Dispensa')) return 'secondary';
    if (modalidade.includes('Inexigibilidade')) return 'outline';
    return 'default';
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contratações</h1>
          </div>
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">⚠️ Erro: {error}</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contratações</h1>
            <p className="text-muted-foreground mt-2">
              Lista completa de contratações monitoradas
            </p>
          </div>
          <Button onClick={carregarContratacoes} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas as Contratações</CardTitle>
            <CardDescription>
              {contratacoes.length} contratação(ões) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Objeto</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Valor Estimado</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratacoes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nenhuma contratação encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      contratacoes.map((contratacao) => (
                        <TableRow key={contratacao.id}>
                          <TableCell className="font-medium">
                            {contratacao.numero_compra}
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate" title={contratacao.objeto}>
                              {contratacao.objeto}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getModalidadeBadgeVariant(contratacao.modalidade_nome)}>
                              {contratacao.modalidade_nome}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatCurrency(contratacao.valor_estimado)}
                          </TableCell>
                          <TableCell>
                            {formatDate(contratacao.data_publicacao)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <a
                                href={contratacao.link_pncp}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver no PNCP
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

