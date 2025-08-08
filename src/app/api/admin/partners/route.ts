import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação de admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
      
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Acesso negado. Apenas administradores podem acessar.' },
          { status: 403 }
        );
      }

      // Buscar todos os parceiros
      const partners = await prisma.partner.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          website: true,
          category: true,
          isActive: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        partners
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao buscar parceiros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação de admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
      
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Acesso negado. Apenas administradores podem criar parceiros.' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const { name, description, logo, website, category } = body;

      // Validações básicas
      if (!name || !description || !category) {
        return NextResponse.json(
          { error: 'Campos obrigatórios não preenchidos' },
          { status: 400 }
        );
      }

      // Criar parceiro
      const partner = await prisma.partner.create({
        data: {
          name,
          description,
          logo,
          website,
          category
        }
      });

      return NextResponse.json({
        success: true,
        partner,
        message: 'Parceiro criado com sucesso'
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao criar parceiro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
