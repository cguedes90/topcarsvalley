import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
          { error: 'Acesso negado' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const { isActive } = body;

      const event = await prisma.event.update({
        where: { id: params.id },
        data: { isActive }
      });

      return NextResponse.json({
        success: true,
        event,
        message: `Evento ${isActive ? 'ativado' : 'desativado'} com sucesso`
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao alterar status do evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
          { error: 'Acesso negado' },
          { status: 403 }
        );
      }

      await prisma.event.delete({
        where: { id: params.id }
      });

      return NextResponse.json({
        success: true,
        message: 'Evento excluído com sucesso'
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
