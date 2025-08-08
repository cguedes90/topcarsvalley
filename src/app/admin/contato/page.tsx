"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  X,
  ArrowLeft,
  Filter,
  UserPlus,
  UserX
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  subjectLabel: string;
  message: string;
  status: string;
  statusLabel: string;
  createdAt: string;
}

const AdminContactPage = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    // Verificar se é admin
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }

    fetchContacts();
  }, [router]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/contact', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setFilteredContacts(data.contacts);
      } else {
        console.error('Erro ao buscar mensagens');
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter(contact => contact.status === statusFilter));
    }
  }, [statusFilter, contacts]);

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    // Aqui você poderia implementar uma API para atualizar o status
    // Por enquanto, vamos apenas atualizar localmente
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: newStatus, statusLabel: getStatusLabel(newStatus) }
          : contact
      )
    );
  };

  const handleInviteAction = async (contactId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/contact/invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId,
          action
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        
        // Atualizar o status local
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId 
              ? { 
                  ...contact, 
                  status: action === 'ACCEPT' ? 'RESOLVED' : 'CLOSED',
                  statusLabel: action === 'ACCEPT' ? 'Resolvido' : 'Fechado'
                }
              : contact
          )
        );

        // Se for aprovação, mostrar link do convite
        if (action === 'ACCEPT' && data.inviteLink) {
          console.log('Link do convite gerado:', data.inviteLink);
        }
        
      } else {
        alert(data.error || 'Erro ao processar solicitação');
      }
    } catch (error) {
      console.error('Erro ao processar convite:', error);
      alert('Erro ao processar solicitação. Tente novamente.');
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Pendente',
      'IN_PROGRESS': 'Em Andamento',
      'RESOLVED': 'Resolvido',
      'CLOSED': 'Fechado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'IN_PROGRESS': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'RESOLVED': 'bg-green-500/10 text-green-500 border-green-500/20',
      'CLOSED': 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    return colors[status] || colors['PENDING'];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red"></div>
      </div>
    );
  }

  if (selectedContact) {
    return (
      <main className="min-h-screen bg-black">
        <Navigation />
        
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                onClick={() => setSelectedContact(null)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white">
                Detalhes da <span className="text-racing-red">Mensagem</span>
              </h1>
            </div>

            {/* Contact Details */}
            <div className="bg-graphite/30 border border-gray-600 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Informações do Contato</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-racing-red" />
                      <div>
                        <span className="text-gray-300 text-sm">Nome:</span>
                        <p className="text-white font-medium">{selectedContact.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-racing-red" />
                      <div>
                        <span className="text-gray-300 text-sm">Email:</span>
                        <p className="text-white font-medium">{selectedContact.email}</p>
                      </div>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-racing-red" />
                        <div>
                          <span className="text-gray-300 text-sm">Telefone:</span>
                          <p className="text-white font-medium">{selectedContact.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedContact.company && (
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-racing-red" />
                        <div>
                          <span className="text-gray-300 text-sm">Empresa:</span>
                          <p className="text-white font-medium">{selectedContact.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Detalhes da Solicitação</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-300 text-sm">Assunto:</span>
                      <p className="text-white font-medium">{selectedContact.subjectLabel}</p>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm">Status:</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedContact.status)}`}>
                          {selectedContact.statusLabel}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-300 text-sm">Data:</span>
                      <p className="text-white font-medium">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Mensagem</h3>
                <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                {selectedContact.subject === 'INVITE_REQUEST' && selectedContact.status === 'PENDING' ? (
                  // Ações específicas para convites
                  <>
                    <Button
                      onClick={() => handleInviteAction(selectedContact.id, 'ACCEPT')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Aprovar Convite
                    </Button>
                    <Button
                      onClick={() => handleInviteAction(selectedContact.id, 'REJECT')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Recusar Convite
                    </Button>
                  </>
                ) : (
                  // Ações padrão para outras mensagens
                  <>
                    <Button
                      onClick={() => updateContactStatus(selectedContact.id, 'IN_PROGRESS')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Marcar como Em Andamento
                    </Button>
                    <Button
                      onClick={() => updateContactStatus(selectedContact.id, 'RESOLVED')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Resolvido
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
                Formulário de <span className="text-racing-red">Contato</span>
              </h1>
              <p className="text-gray-300 font-inter">
                Gerencie as mensagens enviadas pelos usuários
              </p>
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-graphite border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="ALL">Todos</option>
                <option value="PENDING">Pendentes</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="RESOLVED">Resolvidos</option>
                <option value="CLOSED">Fechados</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-graphite/30 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{contacts.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-graphite/30 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {contacts.filter(c => c.status === 'PENDING').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-graphite/30 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {contacts.filter(c => c.status === 'IN_PROGRESS').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-graphite/30 border border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Resolvidos</p>
                  <p className="text-2xl font-bold text-green-500">
                    {contacts.filter(c => c.status === 'RESOLVED').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-graphite/30 border border-gray-600 rounded-lg p-6">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Nenhuma mensagem encontrada</h3>
                <p className="text-gray-400">
                  {statusFilter === 'ALL' 
                    ? 'Ainda não há mensagens de contato.' 
                    : 'Não há mensagens com este status.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`bg-black/50 border rounded-lg p-4 hover:border-racing-red/50 transition-colors ${
                      contact.subject === 'INVITE_REQUEST' 
                        ? 'border-blue-500/50 bg-blue-500/5' 
                        : 'border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {contact.name}
                            {contact.subject === 'INVITE_REQUEST' && (
                              <UserPlus className="h-5 w-5 text-blue-500" />
                            )}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                            {contact.statusLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </span>
                          <span className={contact.subject === 'INVITE_REQUEST' ? 'text-blue-400 font-medium' : ''}>
                            {contact.subjectLabel}
                          </span>
                          <span>{formatDate(contact.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {contact.message}
                        </p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        {contact.subject === 'INVITE_REQUEST' && contact.status === 'PENDING' && (
                          <div className="flex gap-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInviteAction(contact.id, 'ACCEPT');
                              }}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                            >
                              Aprovar
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInviteAction(contact.id, 'REJECT');
                              }}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs"
                            >
                              Recusar
                            </Button>
                          </div>
                        )}
                        <Button
                          onClick={() => setSelectedContact(contact)}
                          variant="outline"
                          size="sm"
                          className="border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default AdminContactPage;
