import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const { name, email, phone, company, subject, message } = JSON.parse(body);

    // Validação dos campos obrigatórios
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Nome, email, assunto e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    // Mapear os assuntos do frontend para o enum do banco
    const subjectMapping: Record<string, string> = {
      'Convite': 'INVITE_REQUEST',
      'Parcerias': 'PARTNERSHIP',
      'Suporte': 'SUPPORT',
      'Eventos': 'EVENT_INFO',
      'Dúvidas': 'OTHER',
      'Outros': 'OTHER'
    };

    const mappedSubject = subjectMapping[subject] || 'OTHER';

    // Criar a mensagem de contato no banco
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject: mappedSubject as any,
        message,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Retornaremos em até 24 horas.',
      contactId: contact.id
    });

  } catch (error) {
    console.error('Erro ao salvar mensagem de contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
      
      // Verificar se é admin
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Acesso negado. Apenas administradores podem visualizar as mensagens.' },
          { status: 403 }
        );
      }

      // Buscar todas as mensagens de contato
      const contacts = await prisma.contact.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Mapear os assuntos de volta para o formato legível
      const subjectLabels: Record<string, string> = {
        'INVITE_REQUEST': 'Solicitar Convite',
        'PARTNERSHIP': 'Parcerias Comerciais',
        'SUPPORT': 'Suporte Técnico',
        'EVENT_INFO': 'Informações sobre Eventos',
        'OTHER': 'Outros Assuntos'
      };

      const statusLabels: Record<string, string> = {
        'PENDING': 'Pendente',
        'IN_PROGRESS': 'Em Andamento',
        'RESOLVED': 'Resolvido',
        'CLOSED': 'Fechado'
      };

      const contactsWithLabels = contacts.map(contact => ({
        ...contact,
        subjectLabel: subjectLabels[contact.subject] || contact.subject,
        statusLabel: statusLabels[contact.status] || contact.status
      }));

      return NextResponse.json({
        success: true,
        contacts: contactsWithLabels
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao buscar mensagens de contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
