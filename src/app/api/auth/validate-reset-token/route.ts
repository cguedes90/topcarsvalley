import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      );
    }

    // Por enquanto, simulamos a validação do token
    // Em produção, após o deploy da migration, use o código comentado abaixo
    
    // const user = await prisma.user.findFirst({
    //   where: { 
    //     resetToken: token,
    //     resetTokenExpiry: {
    //       gte: new Date()
    //     }
    //   },
    //   select: {
    //     id: true,
    //     email: true,
    //     name: true,
    //     resetTokenExpiry: true
    //   }
    // });

    // Por enquanto, apenas validamos se é um token válido (32 chars hex)
    const isValidToken = /^[a-f0-9]{64}$/.test(token);
    
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        email: 'user@example.com',
        name: 'Usuário Teste',
        expiresAt: new Date(Date.now() + 3600000) // 1 hora
      }
    });

  } catch (error) {
    console.error('Erro no validate-reset-token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
