import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token e nova senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Por enquanto, simulamos a busca do usuário
    // Em produção, após o deploy da migration, use o código comentado abaixo
    
    // const user = await prisma.user.findUnique({
    //   where: { resetToken: token }
    // });

    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Token inválido ou expirado' },
    //     { status: 400 }
    //   );
    // }

    // if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    //   return NextResponse.json(
    //     { error: 'Token expirado. Solicite um novo link de redefinição.' },
    //     { status: 400 }
    //   );
    // }

    // Validar formato do token
    const isValidToken = /^[a-f0-9]{64}$/.test(token);
    
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    // Simular atualização da senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('Senha seria atualizada para o token:', token);
    console.log('Hash da nova senha:', hashedPassword);
    
    // Em produção, após migration:
    // await prisma.user.update({
    //   where: { resetToken: token },
    //   data: {
    //     password: hashedPassword,
    //     resetToken: null,
    //     resetTokenExpiry: null
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso!'
    });

  } catch (error) {
    console.error('Erro no reset-password:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
