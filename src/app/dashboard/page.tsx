'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Car, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
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

const MemberDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'MEMBER') {
        router.push('/admin/dashboard');
        return;
      }
      
      // Fetch complete user profile
      fetchUserProfile(parsedUser.id, token);
    } catch (error) {
      router.push('/login');
      return;
    }
  }, [router]);

  const fetchUserProfile = async (userId: string, token: string) => {
    try {
      const response = await fetch(`/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Fallback to localStorage data
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      // Fallback to localStorage data
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-charcoal border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Car className="h-8 w-8 text-racing-red" />
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-white">
                  TopCars Valley
                </h1>
                <p className="text-gray-300">Dashboard do Membro</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Bell className="h-6 w-6 text-gray-400 hover:text-racing-red cursor-pointer" />
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
            Bem-vindo, {user.name || 'Membro'}! 🏎️
          </h2>
          <p className="text-gray-300">
            Você faz parte da comunidade mais exclusiva de entusiastas automotivos do Brasil.
          </p>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-charcoal rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-racing-red" />
              Seu Perfil
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{user.phone}</span>
                  </div>
                )}
                
                {user.profile && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {user.profile.city}, {user.profile.state}
                      {user.profile.cep && ` - ${user.profile.cep}`}
                    </span>
                  </div>
                )}
              </div>
              
              {user.profile && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {user.profile.carBrand} {user.profile.carModel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{user.profile.carYear}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <Button
                onClick={() => router.push('/perfil')}
                variant="outline"
                className="border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-orbitron font-bold text-white mb-4">
              Suas Estatísticas
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-racing-red" />
                  <span className="text-gray-300">Eventos</span>
                </div>
                <span className="text-white font-bold">0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-racing-red" />
                  <span className="text-gray-300">Conexões</span>
                </div>
                <span className="text-white font-bold">0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-racing-red" />
                  <span className="text-gray-300">Pontos</span>
                </div>
                <span className="text-white font-bold">100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            onClick={() => router.push('/eventos')}
            className="bg-racing-red hover:bg-red-700 h-20"
          >
            <div className="text-center">
              <Calendar className="h-6 w-6 mx-auto mb-1" />
              <span className="block">Ver Eventos</span>
            </div>
          </Button>
          
          <Button
            onClick={() => router.push('/membros')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 h-20"
          >
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-1" />
              <span className="block">Comunidade</span>
            </div>
          </Button>
          
          <Button
            onClick={() => router.push('/garagem')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 h-20"
          >
            <div className="text-center">
              <Car className="h-6 w-6 mx-auto mb-1" />
              <span className="block">Minha Garagem</span>
            </div>
          </Button>
        </div>

        {/* Upcoming Events */}
        <div className="bg-charcoal rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-racing-red" />
            Próximos Eventos
          </h3>
          
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              Nenhum evento programado no momento.
            </p>
            <Button
              onClick={() => router.push('/eventos')}
              className="bg-racing-red hover:bg-red-700"
            >
              Explorar Eventos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
