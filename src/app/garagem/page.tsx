'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Calendar, 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Fuel,
  Zap,
  Gauge,
  Camera,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  horsepower?: number;
  description?: string;
  photos?: string[];
  isPublic: boolean;
  owner: {
    name: string;
    profile?: {
      avatar?: string;
    };
  };
  likes: number;
  _count?: {
    likes: number;
    comments: number;
  };
}

const GaragePage = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchVehicles();
  }, [router]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const [allResponse, myResponse] = await Promise.all([
        fetch('/api/garage/vehicles', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch('/api/garage/my-vehicles', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);
      
      if (allResponse.ok && myResponse.ok) {
        const allData = await allResponse.json();
        const myData = await myResponse.json();
        setVehicles(allData.vehicles);
        setMyVehicles(myData.vehicles);
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'electric':
      case 'elétrico':
        return <Zap className="h-4 w-4" />;
      default:
        return <Fuel className="h-4 w-4" />;
    }
  };

  const getFuelTypeLabel = (fuelType: string) => {
    const types: { [key: string]: string } = {
      'gasoline': 'Gasolina',
      'ethanol': 'Etanol',
      'flex': 'Flex',
      'diesel': 'Diesel',
      'electric': 'Elétrico',
      'hybrid': 'Híbrido'
    };
    return types[fuelType.toLowerCase()] || fuelType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando garagem...</div>
      </div>
    );
  }

  const currentVehicles = activeTab === 'all' ? vehicles : myVehicles;

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
                  Garagem TopCars
                </h1>
                <p className="text-gray-300 mt-1">
                  Descubra os carros dos membros da comunidade
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-racing-red hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Veículo
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'default' : 'outline'}
            className={activeTab === 'all' ? 'bg-racing-red' : 'border-gray-600 text-gray-300'}
          >
            Todos os Carros ({vehicles.length})
          </Button>
          <Button
            onClick={() => setActiveTab('mine')}
            variant={activeTab === 'mine' ? 'default' : 'outline'}
            className={activeTab === 'mine' ? 'bg-racing-red' : 'border-gray-600 text-gray-300'}
          >
            Meus Carros ({myVehicles.length})
          </Button>
        </div>

        {/* Vehicles Grid */}
        {currentVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {activeTab === 'all' ? 'Nenhum veículo encontrado' : 'Você ainda não adicionou nenhum veículo'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all' 
                ? 'Seja o primeiro a compartilhar seu carro!' 
                : 'Adicione seu primeiro veículo à garagem.'
              }
            </p>
            {activeTab === 'mine' && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-racing-red hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Veículo
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-charcoal rounded-lg border border-gray-800 hover:border-racing-red/50 transition-colors overflow-hidden"
              >
                {/* Vehicle Image */}
                <div className="h-48 bg-gray-800 relative">
                  {vehicle.photos && vehicle.photos.length > 0 ? (
                    <img 
                      src={vehicle.photos[0]} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Owner Avatar - only for 'all' tab */}
                  {activeTab === 'all' && (
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-gray-700 border-2 border-white overflow-hidden">
                      {vehicle.owner.profile?.avatar ? (
                        <img 
                          src={vehicle.owner.profile.avatar} 
                          alt={vehicle.owner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* My vehicle actions */}
                  {activeTab === 'mine' && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-black/50 border-gray-600 hover:bg-gray-800"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-black/50 border-red-600 hover:bg-red-900 text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <span className="text-racing-red font-medium">
                      {vehicle.year}
                    </span>
                  </div>

                  {activeTab === 'all' && (
                    <p className="text-gray-400 text-sm mb-3">
                      por {vehicle.owner.name}
                    </p>
                  )}

                  {/* Vehicle specs */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      {getFuelIcon(vehicle.fuelType)}
                      <span>{getFuelTypeLabel(vehicle.fuelType)}</span>
                    </div>
                    {vehicle.horsepower && (
                      <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4" />
                        <span>{vehicle.horsepower}hp</span>
                      </div>
                    )}
                  </div>

                  {/* Color */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: vehicle.color.toLowerCase() }}
                    />
                    <span>{vehicle.color}</span>
                  </div>

                  {/* Description */}
                  {vehicle.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{vehicle._count?.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{vehicle._count?.comments || 0}</span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-charcoal rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Adicionar Veículo
            </h3>
            <p className="text-gray-400 mb-6">
              Funcionalidade em desenvolvimento. Em breve você poderá adicionar seus veículos à garagem!
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="border-gray-600"
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

export default GaragePage;
