import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      
      // Buscar todos os veículos do usuário
      const vehicles = await prisma.vehicle.findMany({
        where: {
          ownerId: decoded.userId
        },
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          color: true,
          fuelType: true,
          horsepower: true,
          description: true,
          photos: true,
          isPublic: true,
          owner: {
            select: {
              name: true,
              profile: {
                select: {
                  avatar: true
                }
              }
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        vehicles
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao buscar meus veículos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
