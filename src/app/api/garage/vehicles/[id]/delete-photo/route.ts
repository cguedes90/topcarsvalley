import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const { photoUrl } = await request.json();
    const vehicleId = params.id;

    if (!photoUrl) {
      return NextResponse.json(
        { error: 'URL da foto é obrigatória' },
        { status: 400 }
      );
    }

    // Verificar se o veículo pertence ao usuário
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        ownerId: decoded.userId
      }
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado ou não autorizado' },
        { status: 404 }
      );
    }

    // Verificar se a foto existe no array de fotos do veículo
    if (!vehicle.photos.includes(photoUrl)) {
      return NextResponse.json(
        { error: 'Foto não encontrada neste veículo' },
        { status: 404 }
      );
    }

    // Remover foto do array
    const updatedPhotos = vehicle.photos.filter(photo => photo !== photoUrl);

    // Atualizar veículo no banco
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        photos: updatedPhotos
      },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        photos: true
      }
    });

    // Deletar arquivo físico
    try {
      const fileName = path.basename(photoUrl);
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'vehicles', fileName);
      await unlink(filePath);
      console.log(`Foto deletada: ${fileName}`);
    } catch (fileError) {
      console.warn('Erro ao deletar arquivo físico:', fileError);
      // Continua mesmo se não conseguir deletar o arquivo
    }

    return NextResponse.json({
      success: true,
      message: 'Foto removida com sucesso!',
      vehicle: updatedVehicle
    });

  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
