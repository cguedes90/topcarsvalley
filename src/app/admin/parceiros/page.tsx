'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Building,
  Plus,
  Edit,
  Trash2,
  Globe,
  Tag,
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

const AdminPartnersPage = () => {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!token || userData.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    
    fetchPartners();
  }, [router]);

  useEffect(() => {
    filterPartners();
  }, [partners, searchTerm, filterCategory, filterStatus]);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/partners', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners);
      }
    } catch (error) {
      console.error('Erro ao buscar parceiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = () => {
    let filtered = partners;

    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(partner => partner.category === filterCategory);
    }

    if (filterStatus) {
      if (filterStatus === 'active') {
        filtered = filtered.filter(partner => partner.isActive);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(partner => !partner.isActive);
      }
    }

    setFilteredPartners(filtered);
  };

  const togglePartnerStatus = async (partnerId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/partners/${partnerId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchPartners();
      }
    } catch (error) {
      console.error('Erro ao alterar status do parceiro:', error);
    }
  };

  const deletePartner = async (partnerId: string) => {
    if (!confirm('Tem certeza que deseja excluir este parceiro?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPartners();
      }
    } catch (error) {
      console.error('Erro ao excluir parceiro:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'AUTOMOTIVE': 'Automotivo',
      'TECHNOLOGY': 'Tecnologia',
      'LIFESTYLE': 'Lifestyle',
      'SERVICES': 'Serviços',
      'MEDIA': 'Mídia'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'AUTOMOTIVE': 'bg-racing-red/20 text-racing-red',
      'TECHNOLOGY': 'bg-blue-500/20 text-blue-400',
      'LIFESTYLE': 'bg-purple-500/20 text-purple-400',
      'SERVICES': 'bg-green-500/20 text-green-400',
      'MEDIA': 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando parceiros...</div>
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
                  Gerenciar Parceiros
                </h1>
                <p className="text-gray-300 mt-1">
                  {filteredPartners.length} parceiros encontrados
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-racing-red hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Parceiro
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar parceiros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-charcoal border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
            >
              <option value="">Todas as Categorias</option>
              <option value="AUTOMOTIVE">Automotivo</option>
              <option value="TECHNOLOGY">Tecnologia</option>
              <option value="LIFESTYLE">Lifestyle</option>
              <option value="SERVICES">Serviços</option>
              <option value="MEDIA">Mídia</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-charcoal border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
            >
              <option value="">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>

            {(filterCategory || filterStatus || searchTerm) && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                  setFilterStatus('');
                }}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Partners Grid */}
        {filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Nenhum parceiro encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterCategory || filterStatus
                ? 'Tente ajustar os filtros de pesquisa.'
                : 'Comece adicionando o primeiro parceiro da plataforma.'
              }
            </p>
            {!searchTerm && !filterCategory && !filterStatus && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-racing-red hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Parceiro
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className={`bg-charcoal rounded-lg border border-gray-800 p-6 hover:border-racing-red/50 transition-colors ${
                  !partner.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Partner Logo/Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                      {partner.logo ? (
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {partner.name}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(partner.category)}`}>
                        {getCategoryLabel(partner.category)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      partner.isActive ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className={`text-xs ${
                      partner.isActive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {partner.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {partner.description}
                </p>

                {/* Website */}
                {partner.website && (
                  <div className="mb-4">
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-racing-red hover:text-red-400 text-sm flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Visitar Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-xs text-gray-500">
                    Criado em {new Date(partner.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => togglePartnerStatus(partner.id, partner.isActive)}
                      size="sm"
                      variant="outline"
                      className={`h-8 w-8 p-0 hover:bg-gray-700 ${
                        partner.isActive 
                          ? 'border-green-600 text-green-400 hover:bg-green-900' 
                          : 'border-gray-600 text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {partner.isActive ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      onClick={() => setEditingPartner(partner)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-blue-600 hover:bg-blue-900 text-blue-400"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => deletePartner(partner.id)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-red-600 hover:bg-red-900 text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal Placeholder */}
      {(showCreateModal || editingPartner) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-charcoal rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingPartner ? 'Editar Parceiro' : 'Adicionar Parceiro'}
            </h3>
            <p className="text-gray-400 mb-6">
              Funcionalidade em desenvolvimento. Em breve você poderá {editingPartner ? 'editar' : 'adicionar'} parceiros completos!
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingPartner(null);
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartnersPage;
