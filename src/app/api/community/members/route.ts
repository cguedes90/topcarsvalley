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
      
      // Buscar todos os membros ativos com perfis
      const members = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          role: 'MEMBER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile: {
            select: {
              city: true,
              state: true,
              carBrand: true,
              carModel: true,
              carYear: true,
              bio: true,
              avatar: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return NextResponse.json({
        success: true,
        members
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
