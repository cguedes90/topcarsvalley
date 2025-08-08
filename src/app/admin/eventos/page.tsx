'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  ArrowLeft,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  category: string;
  price: string;
  isPublic: boolean;
  isActive: boolean;
  image?: string;
  _count?: {
    rsvps: number;
  };
}

const AdminEventsPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50,
    category: '',
    price: 'Gratuito',
    isPublic: true
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!token || userData.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    
    fetchEvents();
  }, [router]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterCategory, filterStatus]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(event => event.category === filterCategory);
    }

    if (filterStatus) {
      if (filterStatus === 'active') {
        filtered = filtered.filter(event => event.isActive);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(event => !event.isActive);
      } else if (filterStatus === 'public') {
        filtered = filtered.filter(event => event.isPublic);
      } else if (filterStatus === 'private') {
        filtered = filtered.filter(event => !event.isPublic);
      }
    }

    setFilteredEvents(filtered);
  };

  const toggleEventStatus = async (eventId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/events/${eventId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchEvents();
      } else {
        const error = await response.json();
        alert(`Erro ao alterar status: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao alterar status do evento:', error);
      alert('Erro ao alterar status do evento. Tente novamente.');
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Evento excluído com sucesso!');
        fetchEvents();
      } else {
        const error = await response.json();
        alert(`Erro ao excluir evento: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir evento. Tente novamente.');
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'TRACK_DAY': 'Track Day',
      'ENCONTRO': 'Encontro',
      'WORKSHOP': 'Workshop',
      'ROAD_TRIP': 'Road Trip',
      'EXPOSICAO': 'Exposição',
      'COMPETICAO': 'Competição'
    };
    return categories[category] || category;
  };

  const getStatusColor = (event: Event) => {
    if (!event.isActive) return 'text-red-400';
    if (!event.isPublic) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusLabel = (event: Event) => {
    if (!event.isActive) return 'Inativo';
    if (!event.isPublic) return 'Privado';
    return 'Público';
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSavingEvent(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          shortDescription: '',
          date: '',
          time: '',
          location: '',
          maxParticipants: 50,
          category: '',
          price: 'Gratuito',
          isPublic: true
        });
        fetchEvents();
        alert('Evento criado com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao criar evento: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento. Tente novamente.');
    } finally {
      setSavingEvent(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription || '',
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      maxParticipants: event.maxParticipants,
      category: event.category,
      price: event.price,
      isPublic: event.isPublic
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: 50,
      category: '',
      price: 'Gratuito',
      isPublic: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando eventos...</div>
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
                onClick={() => router.push('/admin/dashboard')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-white">
                  Gerenciar Eventos
                </h1>
                <p className="text-gray-300 mt-1">
                  {filteredEvents.length} eventos encontrados
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-racing-red hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
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
              placeholder="Pesquisar eventos..."
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
              <option value="TRACK_DAY">Track Day</option>
              <option value="ENCONTRO">Encontro</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="ROAD_TRIP">Road Trip</option>
              <option value="EXPOSICAO">Exposição</option>
              <option value="COMPETICAO">Competição</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-charcoal border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
            >
              <option value="">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="public">Públicos</option>
              <option value="private">Privados</option>
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

        {/* Events Table */}
        <div className="bg-charcoal rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-300">Evento</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Data/Hora</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Local</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Categoria</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Participantes</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      Nenhum evento encontrado
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">
                        <div>
                          <h3 className="font-semibold text-white">{event.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-1">
                            {event.shortDescription || event.description}
                          </p>
                          {event.price !== 'Gratuito' && (
                            <div className="flex items-center text-green-400 text-sm mt-1">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {event.price}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="flex items-center text-white">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center text-gray-400 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-gray-300">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="text-sm truncate">{event.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-racing-red/20 text-racing-red px-2 py-1 rounded text-xs font-medium">
                          {getCategoryLabel(event.category)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-gray-300">
                          <Users className="h-3 w-3 mr-1" />
                          <span className="text-sm">
                            {event._count?.rsvps || 0}/{event.maxParticipants}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${getStatusColor(event)}`}>
                          {getStatusLabel(event)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => toggleEventStatus(event.id, event.isActive)}
                            size="sm"
                            variant="outline"
                            className={`h-8 w-8 p-0 hover:bg-gray-700 ${
                              event.isActive 
                                ? 'border-green-600 text-green-400 hover:bg-green-900' 
                                : 'border-gray-600 text-gray-400 hover:bg-gray-800'
                            }`}
                          >
                            {event.isActive ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleEditEvent(event)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-blue-600 hover:bg-blue-900 text-blue-400"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => deleteEvent(event.id)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-red-600 hover:bg-red-900 text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingEvent) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-charcoal rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
            </h3>
            
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Ex: Track Day no Autódromo de Interlagos"
                />
              </div>

              {/* Descrição Curta */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Resumo do evento"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição Completa *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Descreva o evento em detalhes..."
                />
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data do Evento *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  />
                </div>
              </div>

              {/* Local */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Local do Evento *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Ex: Autódromo de Interlagos - São Paulo, SP"
                />
              </div>

              {/* Categoria e Participantes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="TRACK_DAY">Track Day</option>
                    <option value="ENCONTRO">Encontro</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="ROAD_TRIP">Road Trip</option>
                    <option value="EXPOSICAO">Exposição</option>
                    <option value="COMPETICAO">Competição</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Máx. Participantes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  />
                </div>
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preço
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Ex: R$ 100,00 ou Gratuito"
                />
              </div>

              {/* Evento Público */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Evento Público
                  </label>
                  <p className="text-xs text-gray-500">
                    Evento visível para todos os membros
                  </p>
                </div>
                <button
                  onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isPublic ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handleCloseModal}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                disabled={savingEvent}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateEvent}
                className="bg-racing-red hover:bg-red-700"
                disabled={savingEvent}
              >
                {savingEvent ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    {editingEvent ? 'Salvando...' : 'Criando...'}
                  </>
                ) : (
                  editingEvent ? 'Salvar Alterações' : 'Criar Evento'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
