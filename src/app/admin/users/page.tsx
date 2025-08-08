"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Plus, 
  Search, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Eye,
  MoreVertical,
  ArrowLeft,
  Copy,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  isActive: boolean;
  phone: string | null;
  createdAt: string;
  inviteToken: string | null;
  inviteUsedAt: string | null;
  invitedBy: {
    name: string | null;
    email: string;
  } | null;
  _count: {
    eventRSVPs: number;
    invitedUsers: number;
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const AdminUsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    name: "",
    phone: "",
    role: "MEMBER"
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/users?page=${currentPage}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'toggle_status',
          userId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao alterar status do usuário');
        return;
      }

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Erro ao alterar status do usuário');
    }
  };

  const createInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_invite',
          data: inviteForm
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar convite');
      }

      const data = await response.json();
      setInviteResult(data);
      fetchUsers(); // Refresh list
      
      // Reset form
      setInviteForm({
        email: "",
        name: "",
        phone: "",
        role: "MEMBER"
      });
    } catch (error: any) {
      alert(error.message || 'Erro ao criar convite');
    } finally {
      setInviteLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado para a área de transferência!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-racing-red" />
          <p className="text-white">Carregando usuários...</p>
        </div>
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
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-white">
                  Gerenciar Usuários
                </h1>
                <p className="text-gray-300 mt-1">
                  {pagination?.totalCount || 0} usuários cadastrados
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowInviteModal(true)}
              className="bg-racing-red hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Convite
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-charcoal rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-graphite">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Função
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Atividade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Cadastrado
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-graphite/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">
                          {user.name || 'Nome não informado'}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-racing-red/20 text-racing-red' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role === 'ADMIN' ? 'Administrador' : 'Membro'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            {user.inviteUsedAt ? 'Inativo' : 'Convite Pendente'}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div>
                        <div>{user._count.eventRSVPs} eventos</div>
                        <div>{user._count.invitedUsers} convites</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        onClick={() => toggleUserStatus(user.id)}
                        variant="outline"
                        size="sm"
                        className={`${
                          user.isActive 
                            ? 'border-red-500 text-red-400 hover:bg-red-500/10' 
                            : 'border-green-500 text-green-400 hover:bg-green-500/10'
                        }`}
                        disabled={user.role === 'ADMIN'}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-graphite border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Página {pagination.currentPage} de {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  variant="outline"
                  size="sm"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  variant="outline"
                  size="sm"
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-charcoal p-6 rounded-lg border border-gray-800 w-full max-w-md mx-4">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4">
              Criar Convite para Novo Usuário
            </h2>
            
            {inviteResult ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 font-medium mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Convite enviado com sucesso!
                  </p>
                  <p className="text-sm text-gray-300 mb-3">
                    Um email de boas-vindas foi enviado para <strong>{inviteResult.invite.email}</strong> com as instruções para completar o cadastro.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                    <p className="text-blue-400 text-sm font-medium mb-1">
                      📧 Email enviado com:
                    </p>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Link personalizado de cadastro</li>
                      <li>• Instruções de boas-vindas</li>
                      <li>• Prazo de 7 dias para completar</li>
                      <li>• Informações sobre a comunidade</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Link de backup (caso necessário):
                  </p>
                  <div className="bg-black/50 p-3 rounded border border-gray-700 flex items-center gap-2">
                    <code className="text-sm text-blue-400 flex-1 break-all">
                      {inviteResult.inviteLink}
                    </code>
                    <Button
                      onClick={() => copyToClipboard(inviteResult.inviteLink)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setInviteResult(null);
                      setShowInviteModal(false);
                    }}
                    className="flex-1 bg-racing-red hover:bg-red-700"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={createInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                    placeholder="Nome do usuário"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                    placeholder="+55 11 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Função
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                  >
                    <option value="MEMBER">Membro</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteForm({ email: '', name: '', phone: '', role: 'MEMBER' });
                    }}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={inviteLoading}
                    className="flex-1 bg-racing-red hover:bg-red-700"
                  >
                    {inviteLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Convite
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
