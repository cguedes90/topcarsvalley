import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

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

      // Data atual e data de 30 dias atrás
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

      // Buscar estatísticas de usuários
      const [totalUsers, activeUsers, newUsersThisMonth, lastMonthUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.user.count({ where: { createdAt: { lt: thirtyDaysAgo } } })
      ]);

      // Calcular crescimento de usuários
      const usersGrowth = lastMonthUsers > 0 ? 
        ((newUsersThisMonth / lastMonthUsers) * 100) : 100;

      // Buscar estatísticas de eventos
      const [totalEvents, activeEvents, upcomingEvents, totalRSVPs] = await Promise.all([
        prisma.event.count(),
        prisma.event.count({ where: { isActive: true } }),
        prisma.event.count({ where: { date: { gte: now }, isActive: true } }),
        prisma.eventRSVP.count()
      ]);

      // Calcular média de participação em eventos
      const avgParticipation = totalEvents > 0 ? (totalRSVPs / totalEvents) * 100 : 0;

      // Buscar estatísticas de parceiros
      const [totalPartners, activePartners, partnersByCategory] = await Promise.all([
        prisma.partner.count(),
        prisma.partner.count({ where: { isActive: true } }),
        prisma.partner.groupBy({
          by: ['category'],
          _count: { category: true }
        })
      ]);

      // Formatar parceiros por categoria
      const partnersCategoryMap = partnersByCategory.reduce((acc: { [key: string]: number }, item: any) => {
        acc[item.category] = item._count.category;
        return acc;
      }, {} as { [key: string]: number });

      // Buscar estatísticas de veículos
      const [totalVehicles, publicVehicles, topBrands] = await Promise.all([
        prisma.vehicle.count(),
        prisma.vehicle.count({ where: { isPublic: true } }),
        prisma.vehicle.groupBy({
          by: ['brand'],
          _count: { brand: true },
          orderBy: { _count: { brand: 'desc' } },
          take: 5
        })
      ]);

      // Formatar marcas mais populares
      const topBrandsFormatted = topBrands.map((item: any) => ({
        brand: item.brand,
        count: item._count.brand
      }));

      // Buscar estatísticas de contatos
      const [totalContacts, pendingContacts, resolvedContacts, contactsBySubject] = await Promise.all([
        prisma.contact.count(),
        prisma.contact.count({ where: { status: 'PENDING' } }),
        prisma.contact.count({ where: { status: 'RESOLVED' } }),
        prisma.contact.groupBy({
          by: ['subject'],
          _count: { subject: true }
        })
      ]);

      // Formatar contatos por assunto
      const contactsSubjectMap = contactsBySubject.reduce((acc: { [key: string]: number }, item: any) => {
        acc[item.subject] = item._count.subject;
        return acc;
      }, {} as { [key: string]: number });

      const stats = {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          newThisMonth: newUsersThisMonth,
          growth: usersGrowth
        },
        events: {
          total: totalEvents,
          active: activeEvents,
          upcoming: upcomingEvents,
          totalRSVPs: totalRSVPs,
          avgParticipation: avgParticipation
        },
        partners: {
          total: totalPartners,
          active: activePartners,
          byCategory: partnersCategoryMap
        },
        vehicles: {
          total: totalVehicles,
          public: publicVehicles,
          private: totalVehicles - publicVehicles,
          topBrands: topBrandsFormatted
        },
        contacts: {
          total: totalContacts,
          pending: pendingContacts,
          resolved: resolvedContacts,
          bySubject: contactsSubjectMap
        }
      };

      return NextResponse.json({
        success: true,
        stats
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
