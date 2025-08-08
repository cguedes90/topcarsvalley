import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get('photo') as File;
    const vehicleId = formData.get('vehicleId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhuma foto foi enviada' },
        { status: 400 }
      );
    }

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'ID do veículo é obrigatório' },
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

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `vehicle_${vehicleId}_${timestamp}${fileExtension}`;
    
    // Criar diretório se não existir
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'vehicles');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Diretório já existe, continuar
    }

    // Salvar arquivo
    const filePath = path.join(uploadsDir, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Atualizar veículo no banco com a nova foto
    const photoUrl = `/uploads/vehicles/${fileName}`;
    
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        photos: {
          push: photoUrl // Adiciona a nova foto ao array existente
        }
      },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        photos: true,
        owner: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Foto enviada com sucesso!',
      photoUrl,
      vehicle: updatedVehicle
    });

  } catch (error) {
    console.error('Erro no upload da foto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
