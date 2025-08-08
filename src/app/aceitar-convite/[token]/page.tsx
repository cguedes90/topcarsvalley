'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, MapPin, Calendar, Phone, User, Mail, Loader2 } from 'lucide-react';

interface InviteData {
  id: string;
  email: string;
  name: string;
  role: string;
  inviteToken: string;
}

const AcceptInvitePage = () => {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    birthDate: '',
    phone: '',
    cep: '',
    city: '',
    state: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    password: '',
    confirmPassword: '',
  });

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const marcasCarros = [
    'Audi', 'BMW', 'Ferrari', 'Lamborghini', 'Maserati', 'McLaren',
    'Mercedes-Benz', 'Porsche', 'Aston Martin', 'Bentley', 'Bugatti',
    'Chevrolet Corvette', 'Dodge', 'Ford Mustang', 'Jaguar', 'Lotus',
    'Nissan GTR', 'Toyota Supra', 'Subaru', 'Mitsubishi', 'Honda NSX',
    'Pagani', 'Koenigsegg', 'Rolls-Royce', 'Outro'
  ];

  useEffect(() => {
    if (token) {
      fetchInviteData();
    }
  }, [token]);

  const fetchInviteData = async () => {
    try {
      const response = await fetch(`/api/invite/validate?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setInviteData(data.invite);
        setForm(prev => ({
          ...prev,
          name: data.invite.name || '',
          email: data.invite.email || '',
        }));
      } else {
        setError(data.error || 'Convite inválido ou expirado');
      }
    } catch (error) {
      setError('Erro ao validar convite');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          city: data.localidade || '',
          state: data.uf || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    setForm(prev => ({ ...prev, cep }));
    
    if (cep.length === 8) {
      fetchAddressByCep(cep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem');
      setSubmitting(false);
      return;
    }

    if (form.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          ...form,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/cadastro-concluido');
      } else {
        setError(data.error || 'Erro ao completar cadastro');
      }
    } catch (error) {
      setError('Erro interno do servidor');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-racing-red" />
          <p className="text-white">Validando convite...</p>
        </div>
      </div>
    );
  }

  if (error && !inviteData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-orbitron font-bold text-red-400 mb-2">
              Convite Inválido
            </h2>
            <p className="text-red-300">{error}</p>
          </div>
          <Button
            onClick={() => router.push('/')}
            className="bg-racing-red hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏎️</div>
          <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
            Bem-vindo à TopCars Valley!
          </h1>
          <p className="text-gray-300">
            Complete seu cadastro para fazer parte da nossa comunidade exclusiva
          </p>
          {inviteData && (
            <div className="bg-racing-red/10 border border-racing-red/30 rounded-lg p-4 mt-4">
              <p className="text-racing-red font-medium">
                Convite para: {inviteData.email}
              </p>
              <p className="text-sm text-gray-300">
                Função: {inviteData.role === 'ADMIN' ? 'Administrador' : 'Membro'}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-racing-red" />
              Dados Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  required
                  value={form.birthDate}
                  onChange={(e) => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="+55 11 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-racing-red" />
              Localização
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={form.cep}
                  onChange={handleCepChange}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="00000000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Sua cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  required
                  value={form.state}
                  onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                >
                  <option value="">Selecione</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Veículo */}
          <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2 text-racing-red" />
              Veículo Principal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Marca *
                </label>
                <select
                  required
                  value={form.carBrand}
                  onChange={(e) => setForm(prev => ({ ...prev, carBrand: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                >
                  <option value="">Selecione</option>
                  {marcasCarros.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  required
                  value={form.carModel}
                  onChange={(e) => setForm(prev => ({ ...prev, carModel: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Ex: 911 Turbo S"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ano *
                </label>
                <input
                  type="number"
                  required
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={form.carYear}
                  onChange={(e) => setForm(prev => ({ ...prev, carYear: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="2024"
                />
              </div>
            </div>
          </div>

          {/* Senha */}
          <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4">
              Definir Senha
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Repita a senha"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-2 bg-racing-red hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Finalizar Cadastro
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
