'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Camera, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface VehiclePhotoUploaderProps {
  vehicleId: string;
  photos: string[];
  onPhotosUpdate: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function VehiclePhotoUploader({ 
  vehicleId, 
  photos, 
  onPhotosUpdate, 
  maxPhotos = 5 
}: VehiclePhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('vehicleId', vehicleId);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`/api/garage/vehicles/${vehicleId}/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  };

  const deletePhoto = async (photoUrl: string) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`/api/garage/vehicles/${vehicleId}/delete-photo`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoUrl }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  };

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    if (uploading || photos.length >= maxPhotos) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxPhotos - photos.length;
    const filesToUpload = fileArray.slice(0, remainingSlots);

    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(file => uploadPhoto(file));
      const results = await Promise.all(uploadPromises);
      
      const newPhotos = results.map(result => result.photoUrl);
      onPhotosUpdate([...photos, ...newPhotos]);
      
      // Mostrar sucesso
      console.log(`${newPhotos.length} foto(s) enviada(s) com sucesso!`);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload da foto');
    } finally {
      setUploading(false);
    }
  }, [vehicleId, photos, maxPhotos, uploading, onPhotosUpdate]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDeletePhoto = async (photoUrl: string) => {
    try {
      await deletePhoto(photoUrl);
      const updatedPhotos = photos.filter(photo => photo !== photoUrl);
      onPhotosUpdate(updatedPhotos);
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      alert(error instanceof Error ? error.message : 'Erro ao deletar foto');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <Card className={`border-2 border-dashed transition-colors ${
          dragOver 
            ? 'border-racing-red bg-racing-red/5' 
            : 'border-steel/30 hover:border-steel/50'
        }`}>
          <CardContent className="p-6">
            <div
              className="text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="mx-auto mb-4 w-12 h-12 bg-steel/20 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-steel" />
              </div>
              
              <p className="text-white mb-2 font-medium">
                Adicionar fotos do veículo
              </p>
              <p className="text-steel text-sm mb-4">
                Arraste e solte ou clique para selecionar
                <br />
                Máximo {maxPhotos} fotos • JPG, PNG, WebP • Até 5MB cada
              </p>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="vehicle-photo-upload"
                disabled={uploading}
              />
              
              <label htmlFor="vehicle-photo-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Fotos
                    </>
                  )}
                </Button>
              </label>
              
              <p className="text-steel text-xs mt-2">
                {photos.length}/{maxPhotos} fotos
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card key={photo} className="group relative overflow-hidden bg-charcoal/80 border-steel/30">
              <CardContent className="p-0 aspect-square">
                <div className="relative w-full h-full">
                  <Image
                    src={photo}
                    alt={`Foto ${index + 1} do veículo`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  
                  {/* Photo Index */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
                    {index + 1}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Photos State */}
      {photos.length === 0 && (
        <Card className="bg-charcoal/40 border-steel/20">
          <CardContent className="p-8 text-center">
            <ImageIcon className="w-12 h-12 text-steel/50 mx-auto mb-3" />
            <p className="text-steel">
              Nenhuma foto adicionada ainda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
