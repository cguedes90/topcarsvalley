import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

interface JWTPayload {
  userId: string;
  email: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token de autenticação obrigatório' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário é o dono do veículo
    if (vehicle.ownerId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado a visualizar este veículo' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle,
    });

  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token de autenticação obrigatório' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Verificar se o veículo existe e pertence ao usuário
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Veículo não encontrado' },
        { status: 404 }
      );
    }

    if (existingVehicle.ownerId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado a editar este veículo' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      brand,
      model,
      year,
      color,
      fuelType,
      horsepower,
      description,
      isPublic,
    } = body;

    // Validações
    if (!brand?.trim() || !model?.trim() || !year || !color?.trim() || !fuelType?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: marca, modelo, ano, cor e combustível' },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      return NextResponse.json(
        { success: false, error: 'Ano inválido' },
        { status: 400 }
      );
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        brand: brand.trim(),
        model: model.trim(),
        year: parseInt(year),
        color: color.trim(),
        fuelType: fuelType.trim(),
        horsepower: horsepower ? parseInt(horsepower) : null,
        description: description?.trim() || null,
        isPublic: Boolean(isPublic),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      vehicle: updatedVehicle,
    });

  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
