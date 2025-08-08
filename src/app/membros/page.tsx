'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  MapPin, 
  Car, 
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  profile?: {
    city: string;
    state: string;
    carBrand: string;
    carModel: string;
    carYear: number;
    bio?: string;
    avatar?: string;
  };
}

const CommunityPage = () => {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterState, setFilterState] = useState('');
  const [filterBrand, setFilterBrand] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchMembers();
  }, [router]);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, filterState, filterBrand]);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/community/members', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.profile?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.profile?.carBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.profile?.carModel?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by state
    if (filterState) {
      filtered = filtered.filter(member =>
        member.profile?.state === filterState
      );
    }

    // Filter by car brand
    if (filterBrand) {
      filtered = filtered.filter(member =>
        member.profile?.carBrand === filterBrand
      );
    }

    setFilteredMembers(filtered);
  };

  const getUniqueStates = () => {
    const states = members
      .map(member => member.profile?.state)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return states.sort();
  };

  const getUniqueBrands = () => {
    const brands = members
      .map(member => member.profile?.carBrand)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return brands.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando comunidade...</div>
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
                onClick={() => router.push('/dashboard')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-white">
                  Comunidade TopCars
                </h1>
                <p className="text-gray-300 mt-1">
                  {filteredMembers.length} membros encontrados
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                className={viewMode === 'grid' ? 'bg-racing-red' : 'border-gray-600'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                className={viewMode === 'list' ? 'bg-racing-red' : 'border-gray-600'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, cidade ou carro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-2 bg-charcoal border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
            >
              <option value="">Todos os Estados</option>
              {getUniqueStates().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="px-4 py-2 bg-charcoal border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
            >
              <option value="">Todas as Marcas</option>
              {getUniqueBrands().map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            {(filterState || filterBrand || searchTerm) && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterState('');
                  setFilterBrand('');
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

        {/* Members Grid/List */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termo de pesquisa.
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
            'space-y-4'
          }>
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className={`bg-charcoal rounded-lg border border-gray-800 hover:border-racing-red/50 transition-colors ${
                  viewMode === 'list' ? 'p-4' : 'p-6'
                }`}
              >
                <div className={viewMode === 'list' ? 'flex items-center gap-4' : ''}>
                  {/* Avatar */}
                  <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-20 h-20 mx-auto'} rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden mb-4 ${viewMode === 'list' ? 'mb-0 flex-shrink-0' : ''}`}>
                    {member.profile?.avatar ? (
                      <img 
                        src={member.profile.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className={`${viewMode === 'list' ? 'h-6 w-6' : 'h-8 w-8'} text-gray-500`} />
                    )}
                  </div>

                  <div className={`${viewMode === 'list' ? 'flex-1' : 'text-center'}`}>
                    {/* Name and Location */}
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {member.name}
                    </h3>
                    
                    {member.profile?.city && (
                      <div className={`flex items-center gap-1 text-gray-400 text-sm mb-2 ${viewMode === 'list' ? '' : 'justify-center'}`}>
                        <MapPin className="h-3 w-3" />
                        <span>{member.profile.city}, {member.profile.state}</span>
                      </div>
                    )}

                    {/* Car Info */}
                    {member.profile?.carBrand && (
                      <div className={`flex items-center gap-1 text-racing-red text-sm mb-3 ${viewMode === 'list' ? '' : 'justify-center'}`}>
                        <Car className="h-3 w-3" />
                        <span>
                          {member.profile.carBrand} {member.profile.carModel} 
                          {member.profile.carYear && ` (${member.profile.carYear})`}
                        </span>
                      </div>
                    )}

                    {/* Bio */}
                    {member.profile?.bio && viewMode === 'grid' && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {member.profile.bio}
                      </p>
                    )}

                    {/* Actions */}
                    <div className={`flex gap-2 ${viewMode === 'list' ? '' : 'justify-center'}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Conectar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
