import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { sendInviteEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso necessário' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Get users with pagination
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const search = request.nextUrl.searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          phone: true,
          createdAt: true,
          inviteToken: true,
          inviteUsedAt: true,
          invitedBy: {
            select: {
              name: true,
              email: true,
            }
          },
          _count: {
            select: {
              eventRSVPs: true,
              invitedUsers: true,
            }
          }
        },
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso necessário' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { action, userId, data } = await request.json();

    if (action === 'create_invite') {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Este email já está cadastrado no sistema' },
          { status: 400 }
        );
      }

      // Create invite token
      const inviteToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      const invite = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name || null,
          phone: data.phone || null,
          role: data.role || 'MEMBER',
          isActive: false,
          inviteToken,
          invitedById: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          inviteToken: true,
          role: true,
        }
      });

      // Send invite email
      try {
        await sendInviteEmail({
          to: invite.email,
          name: invite.name || '',
          inviteToken,
        });
        console.log(`✅ Email de convite enviado para: ${invite.email}`);
      } catch (emailError) {
        console.error('❌ Erro ao enviar email de convite:', emailError);
        // Continue without failing - the invite is created, just email failed
      }

      return NextResponse.json({
        success: true,
        invite,
        inviteLink: `${process.env.NEXTAUTH_URL}/aceitar-convite/${inviteToken}`,
        emailSent: true
      });
    }

    if (action === 'toggle_status' && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isActive: true, role: true }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      // Prevent deactivating other admins
      if (user.role === 'ADMIN' && userId !== decoded.userId) {
        return NextResponse.json(
          { error: 'Não é possível desativar outros administradores' },
          { status: 403 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive },
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          role: true,
        }
      });

      return NextResponse.json({
        success: true,
        user: updatedUser
      });
    }

    return NextResponse.json(
      { error: 'Ação inválida' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error managing users:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
