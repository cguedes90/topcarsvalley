import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando processamento de aceite de convite...');
    
    const body = await request.json();
    console.log('📝 Dados recebidos:', { ...body, password: '***' });
    
    const {
      token,
      name,
      birthDate,
      phone,
      cep,
      city,
      state,
      carBrand,
      carModel,
      carYear,
      password,
    } = body;

    if (!token || !password) {
      console.log('❌ Dados obrigatórios faltando');
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    console.log('🔍 Buscando usuário pelo token:', token);
    
    // Find user with this invite token
    const user = await prisma.user.findFirst({
      where: {
        inviteToken: token,
        inviteUsedAt: null, // Not used yet
      }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado ou convite já usado');
      return NextResponse.json(
        { success: false, error: 'Convite inválido ou já utilizado' },
        { status: 404 }
      );
    }

    console.log('✅ Usuário encontrado:', user.email);

    // Check if invite is expired (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (user.createdAt < sevenDaysAgo) {
      console.log('❌ Convite expirado');
      return NextResponse.json(
        { success: false, error: 'Este convite expirou' },
        { status: 410 }
      );
    }

    console.log('🔐 Gerando hash da senha...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('💾 Atualizando usuário no banco...');

    // Update user with complete data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone,
        password: hashedPassword,
        isActive: true,
        inviteUsedAt: new Date(),
        profile: {
          create: {
            birthDate: birthDate ? new Date(birthDate) : null,
            cep,
            city,
            state,
            carBrand,
            carModel,
            carYear: carYear ? parseInt(carYear) : null,
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: {
          select: {
            city: true,
            state: true,
            carBrand: true,
            carModel: true,
            carYear: true,
          }
        }
      }
    });

    console.log('✅ Usuário atualizado com sucesso:', updatedUser.email);

    return NextResponse.json({
      success: true,
      message: 'Cadastro concluído com sucesso!',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Erro completo ao aceitar convite:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
