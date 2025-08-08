'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  Users,
  Calendar,
  Building,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Download,
  RefreshCw,
  Car,
  Mail,
  UserCheck,
  UserX,
  Activity
} from 'lucide-react';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growth: number;
  };
  events: {
    total: number;
    active: number;
    upcoming: number;
    totalRSVPs: number;
    avgParticipation: number;
  };
  partners: {
    total: number;
    active: number;
    byCategory: { [key: string]: number };
  };
  vehicles: {
    total: number;
    public: number;
    private: number;
    topBrands: Array<{ brand: string; count: number }>;
  };
  contacts: {
    total: number;
    pending: number;
    resolved: number;
    bySubject: { [key: string]: number };
  };
}

const AdminReportsPage = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!token || userData.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando relatórios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-charcoal border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-white">
                  Relatórios e Estatísticas
                </h1>
                <p className="text-gray-300 mt-1">
                  Visão geral da plataforma TopCars Valley
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-600 text-green-400 hover:bg-green-900"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!stats ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Erro ao carregar estatísticas
            </h3>
            <p className="text-gray-500 mb-6">
              Tente atualizar a página ou entre em contato com o suporte.
            </p>
            <Button
              onClick={handleRefresh}
              className="bg-racing-red hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Users Card */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total de Usuários</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(stats.users.total)}
                    </p>
                    <div className="flex items-center mt-2">
                      {stats.users.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                      )}
                      <span className={`text-xs ${
                        stats.users.growth >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercentage(stats.users.growth)} este mês
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Events Card */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total de Eventos</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(stats.events.total)}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {stats.events.upcoming} próximos eventos
                    </p>
                  </div>
                  <div className="bg-racing-red/20 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-racing-red" />
                  </div>
                </div>
              </div>

              {/* Partners Card */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Parceiros Ativos</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(stats.partners.active)}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      de {stats.partners.total} parceiros
                    </p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Vehicles Card */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Veículos Cadastrados</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(stats.vehicles.total)}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {stats.vehicles.public} públicos
                    </p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <Car className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Users Details */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Análise de Usuários
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-gray-300">Usuários Ativos</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatNumber(stats.users.active)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserX className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-gray-300">Usuários Inativos</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatNumber(stats.users.inactive)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-gray-300">Novos este mês</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatNumber(stats.users.newThisMonth)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Events Details */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-racing-red" />
                  Análise de Eventos
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Eventos Ativos</span>
                    <span className="text-white font-medium">
                      {formatNumber(stats.events.active)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total de RSVPs</span>
                    <span className="text-white font-medium">
                      {formatNumber(stats.events.totalRSVPs)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Média de Participação</span>
                    <span className="text-white font-medium">
                      {stats.events.avgParticipation.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Partners by Category */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-400" />
                  Parceiros por Categoria
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.partners.byCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">
                        {category.toLowerCase().replace('_', ' ')}
                      </span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-green-400 h-2 rounded-full"
                            style={{
                              width: `${(count / stats.partners.total) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-white font-medium w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Vehicle Brands */}
              <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-purple-400" />
                  Marcas Mais Populares
                </h3>
                <div className="space-y-3">
                  {stats.vehicles.topBrands.map((brand, index) => (
                    <div key={brand.brand} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded mr-3">
                          #{index + 1}
                        </span>
                        <span className="text-gray-300">{brand.brand}</span>
                      </div>
                      <span className="text-white font-medium">
                        {brand.count} veículos
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Analysis */}
            <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-yellow-400" />
                Análise de Contatos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(stats.contacts.total)}
                  </p>
                  <p className="text-gray-400">Total de Contatos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {formatNumber(stats.contacts.pending)}
                  </p>
                  <p className="text-gray-400">Pendentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {formatNumber(stats.contacts.resolved)}
                  </p>
                  <p className="text-gray-400">Resolvidos</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
