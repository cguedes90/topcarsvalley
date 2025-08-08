import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Buscar apenas parceiros ativos
    const partners = await prisma.partner.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        website: true,
        category: true,
        createdAt: true
      },
      orderBy: [
        {
          category: 'asc'
        },
        {
          name: 'asc'
        }
      ]
    });

    return NextResponse.json({
      success: true,
      partners
    });

  } catch (error) {
    console.error('Erro ao buscar parceiros:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor ao buscar parceiros' 
      },
      { status: 500 }
    );
  }
}
