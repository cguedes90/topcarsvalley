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

      // Buscar todos os eventos
      const events = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          shortDescription: true,
          date: true,
          time: true,
          location: true,
          maxParticipants: true,
          category: true,
          price: true,
          isPublic: true,
          isActive: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              rsvps: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        events
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
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
          { error: 'Acesso negado. Apenas administradores podem criar eventos.' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const {
        title,
        description,
        shortDescription,
        date,
        time,
        location,
        maxParticipants,
        category,
        price,
        isPublic,
        image
      } = body;

      // Validações básicas
      if (!title || !description || !date || !time || !location || !maxParticipants || !category) {
        return NextResponse.json(
          { error: 'Campos obrigatórios não preenchidos' },
          { status: 400 }
        );
      }

      // Criar evento
      const event = await prisma.event.create({
        data: {
          title,
          description,
          shortDescription,
          date: new Date(date),
          time,
          location,
          maxParticipants: parseInt(maxParticipants),
          category,
          price: price || 'Gratuito',
          isPublic: isPublic !== false,
          image
        }
      });

      return NextResponse.json({
        success: true,
        event,
        message: 'Evento criado com sucesso'
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
