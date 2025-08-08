"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Building, 
  Settings, 
  BarChart3, 
  Shield,
  LogOut,
  UserCheck,
  CalendarPlus,
  MessageSquare
} from "lucide-react";

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'ADMIN') {
        router.push('/dashboard'); // Redirect non-admin users
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      router.push('/login');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const adminFeatures = [
    {
      title: "Gerenciar Usuários",
      description: "Visualizar, editar e gerenciar todos os usuários da plataforma",
      icon: Users,
      href: "/admin/users",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Gerenciar Eventos",
      description: "Criar, editar e gerenciar eventos públicos e privados",
      icon: Calendar,
      href: "/admin/eventos",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Gerenciar Parceiros",
      description: "Administrar parceiros oficiais e suas informações",
      icon: Building,
      href: "/admin/parceiros",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Formulário de Contato",
      description: "Visualizar e gerenciar mensagens enviadas pelo formulário de contato",
      icon: MessageSquare,
      href: "/admin/contato",
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "Relatórios",
      description: "Visualizar estatísticas e relatórios da plataforma",
      icon: BarChart3,
      href: "/admin/relatorios",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Configurações",
      description: "Configurações gerais do sistema e da plataforma",
      icon: Settings,
      href: "/admin/configuracoes",
      color: "from-gray-500 to-gray-600"
    },
  ];

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
                Dashboard <span className="text-racing-red">Admin</span>
              </h1>
              <p className="text-gray-300 font-inter">
                Bem-vindo, <span className="text-white font-semibold">{user.name || user.email}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-racing-red/10 border border-racing-red/30 rounded-lg px-3 py-2">
                <Shield className="h-5 w-5 text-racing-red" />
                <span className="text-racing-red font-medium">Admin</span>
              </div>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-charcoal/50 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-inter">Total de Usuários</p>
                  <p className="text-2xl font-bold text-white">150+</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-charcoal/50 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-inter">Eventos Ativos</p>
                  <p className="text-2xl font-bold text-white">6</p>
                </div>
                <CalendarPlus className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-charcoal/50 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-inter">Parceiros Ativos</p>
                  <p className="text-2xl font-bold text-white">4</p>
                </div>
                <Building className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Admin Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group bg-charcoal/30 border border-gray-800 rounded-lg p-6 hover:border-racing-red/50 transition-all duration-300 cursor-pointer"
                onClick={() => router.push(feature.href)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-orbitron font-semibold text-white mb-2 group-hover:text-racing-red transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 font-inter text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default AdminDashboard;
