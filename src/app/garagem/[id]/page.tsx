'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/navigation/Footer';
import VehiclePhotoUploader from '@/components/garage/VehiclePhotoUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car, Edit3, Save } from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  horsepower?: number;
  description?: string;
  photos: string[];
  isPublic: boolean;
  owner: {
    name: string;
    profile?: {
      avatar?: string;
    };
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    fuelType: 'Gasolina',
    horsepower: 0,
    description: '',
    isPublic: true
  });

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/garage/vehicles/${vehicleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Veículo não encontrado');
      }

      const data = await response.json();
      setVehicle(data.vehicle);
      setFormData({
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year,
        color: data.vehicle.color,
        fuelType: data.vehicle.fuelType,
        horsepower: data.vehicle.horsepower || 0,
        description: data.vehicle.description || '',
        isPublic: data.vehicle.isPublic
      });
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
      alert('Erro ao carregar veículo');
      router.push('/garagem');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/garage/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      setVehicle(data.vehicle);
      setEditing(false);
      alert('Veículo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar veículo');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotosUpdate = (photos: string[]) => {
    if (vehicle) {
      setVehicle({ ...vehicle, photos });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-racing-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Carregando veículo...
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-center">
            <Car className="w-16 h-16 text-steel mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Veículo não encontrado</h1>
            <Button onClick={() => router.push('/garagem')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Garagem
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push('/garagem')}
            variant="ghost"
            className="text-steel hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Garagem
          </Button>
          
          <div className="flex gap-2">
            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                className="bg-racing-red hover:bg-racing-red/80"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setEditing(false)}
                  variant="outline"
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-racing-red hover:bg-racing-red/80"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fotos */}
          <div>
            <Card className="bg-charcoal/80 border-steel/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-racing-red" />
                  Fotos do Veículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VehiclePhotoUploader
                  vehicleId={vehicleId}
                  photos={vehicle.photos}
                  onPhotosUpdate={handlePhotosUpdate}
                  maxPhotos={5}
                />
              </CardContent>
            </Card>
          </div>

          {/* Informações */}
          <div>
            <Card className="bg-charcoal/80 border-steel/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  {editing ? 'Editar Veículo' : 'Informações do Veículo'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {editing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand" className="text-white">Marca</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="bg-black/50 border-steel/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model" className="text-white">Modelo</Label>
                        <Input
                          id="model"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          className="bg-black/50 border-steel/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="year" className="text-white">Ano</Label>
                        <Input
                          id="year"
                          type="number"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          className="bg-black/50 border-steel/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="color" className="text-white">Cor</Label>
                        <Input
                          id="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="bg-black/50 border-steel/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fuelType" className="text-white">Combustível</Label>
                        <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                          <SelectTrigger className="bg-black/50 border-steel/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gasolina">Gasolina</SelectItem>
                            <SelectItem value="Etanol">Etanol</SelectItem>
                            <SelectItem value="Flex">Flex</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Elétrico">Elétrico</SelectItem>
                            <SelectItem value="Híbrido">Híbrido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="horsepower" className="text-white">Potência (CV)</Label>
                        <Input
                          id="horsepower"
                          type="number"
                          value={formData.horsepower}
                          onChange={(e) => setFormData({ ...formData, horsepower: parseInt(e.target.value) || 0 })}
                          className="bg-black/50 border-steel/30 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-black/50 border-steel/30 text-white resize-none"
                        rows={4}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-steel">Marca</Label>
                        <p className="text-white font-semibold">{vehicle.brand}</p>
                      </div>
                      <div>
                        <Label className="text-steel">Modelo</Label>
                        <p className="text-white font-semibold">{vehicle.model}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-steel">Ano</Label>
                        <p className="text-white font-semibold">{vehicle.year}</p>
                      </div>
                      <div>
                        <Label className="text-steel">Cor</Label>
                        <p className="text-white font-semibold">{vehicle.color}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-steel">Combustível</Label>
                        <p className="text-white font-semibold">{vehicle.fuelType}</p>
                      </div>
                      {vehicle.horsepower && (
                        <div>
                          <Label className="text-steel">Potência</Label>
                          <p className="text-white font-semibold">{vehicle.horsepower} CV</p>
                        </div>
                      )}
                    </div>

                    {vehicle.description && (
                      <div>
                        <Label className="text-steel">Descrição</Label>
                        <p className="text-white">{vehicle.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-steel">Curtidas</Label>
                        <p className="text-white font-semibold">{vehicle._count.likes}</p>
                      </div>
                      <div>
                        <Label className="text-steel">Comentários</Label>
                        <p className="text-white font-semibold">{vehicle._count.comments}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
