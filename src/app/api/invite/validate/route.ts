import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 400 }
      );
    }

    // Find user with this invite token
    const user = await prisma.user.findFirst({
      where: {
        inviteToken: token,
        inviteUsedAt: null, // Not used yet
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        inviteToken: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Convite inválido ou já utilizado' },
        { status: 404 }
      );
    }

    // Check if invite is expired (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (user.createdAt < sevenDaysAgo) {
      return NextResponse.json(
        { success: false, error: 'Este convite expirou' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      invite: user
    });

  } catch (error) {
    console.error('Error validating invite:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
