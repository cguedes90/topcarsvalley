'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Camera,
  Save,
  ArrowLeft,
  Upload,
  X
} from 'lucide-react';
import Image from 'next/image';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile?: {
    birthDate: string;
    cep: string;
    city: string;
    state: string;
    carBrand: string;
    carModel: string;
    carYear: number;
    bio?: string;
    avatar?: string;
  };
}

const EditProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    birthDate: '',
    cep: '',
    city: '',
    state: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    bio: '',
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
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchUserProfile();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Preencher formulário
        setForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          birthDate: data.user.profile?.birthDate ? data.user.profile.birthDate.split('T')[0] : '',
          cep: data.user.profile?.cep || '',
          city: data.user.profile?.city || '',
          state: data.user.profile?.state || '',
          carBrand: data.user.profile?.carBrand || '',
          carModel: data.user.profile?.carModel || '',
          carYear: data.user.profile?.carYear?.toString() || '',
          bio: data.user.profile?.bio || '',
        });
        
        if (data.user.profile?.avatar) {
          setAvatarPreview(data.user.profile.avatar);
        }
      }
    } catch (error) {
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Imagem deve ter no máximo 5MB');
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      
      // Adicionar dados do formulário
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      // Adicionar avatar se selecionado
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Perfil atualizado com sucesso!');
        
        // Atualizar localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          name: form.name,
          phone: form.phone,
        }));
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      setError('Erro interno do servidor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-charcoal border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
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
                Editar Perfil
              </h1>
              <p className="text-gray-300 mt-1">
                Atualize suas informações pessoais
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-racing-red" />
              Foto do Perfil
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview('');
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                )}
              </div>
              
              <div>
                <label className="cursor-pointer">
                  <div className="bg-racing-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Upload className="h-4 w-4" />
                    Escolher Foto
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG ou GIF. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

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
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-racing-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="+55 11 99999-9999"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red resize-none"
                placeholder="Conte um pouco sobre você e sua paixão por carros..."
              />
            </div>
          </div>

          {/* Localização */}
          <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-racing-red" />
              Localização
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CEP
                </label>
                <input
                  type="text"
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
                  Cidade
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Sua cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado
                </label>
                <select
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
                  Marca
                </label>
                <select
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
                  Modelo
                </label>
                <input
                  type="text"
                  value={form.carModel}
                  onChange={(e) => setForm(prev => ({ ...prev, carModel: e.target.value }))}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red"
                  placeholder="Ex: 911 Turbo S"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ano
                </label>
                <input
                  type="number"
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

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-2 bg-racing-red hover:bg-red-700"
            >
              {saving ? 'Salvando...' : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
