import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// API para ações de convites (aceitar/recusar)
export async function POST(request: NextRequest) {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
      
      // Verificar se é admin
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Acesso negado. Apenas administradores podem processar convites.' },
          { status: 403 }
        );
      }

      const { contactId, action, inviteToken } = await request.json();

      if (!contactId || !action) {
        return NextResponse.json(
          { error: 'ID do contato e ação são obrigatórios' },
          { status: 400 }
        );
      }

      // Buscar o contato
      const contact = await prisma.contact.findUnique({
        where: { id: contactId }
      });

      if (!contact) {
        return NextResponse.json(
          { error: 'Contato não encontrado' },
          { status: 404 }
        );
      }

      // Verificar se é uma solicitação de convite
      if (contact.subject !== 'INVITE_REQUEST') {
        return NextResponse.json(
          { error: 'Esta ação só pode ser executada em solicitações de convite' },
          { status: 400 }
        );
      }

      if (action === 'ACCEPT') {
        // Gerar token de convite
        const generatedToken = inviteToken || generateInviteToken();
        
        // Atualizar status do contato
        await prisma.contact.update({
          where: { id: contactId },
          data: { 
            status: 'RESOLVED',
            updatedAt: new Date()
          }
        });

        // Criar usuário com convite pendente
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: contact.email }
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                role: 'MEMBER',
                isActive: false, // Ativo apenas após completar o cadastro
                inviteToken: generatedToken
              }
            });
          } else {
            // Atualizar token se usuário já existir
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { inviteToken: generatedToken }
            });
          }

          // Simular envio de email (aqui você integraria com um serviço real)
          const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/convite/${generatedToken}`;
          console.log('EMAIL ENVIADO PARA:', contact.email);
          console.log('LINK DO CONVITE:', inviteLink);
          
          // Aqui você integraria com um serviço de email como SendGrid, Nodemailer, etc.
          await sendInviteEmail(contact.email, contact.name, inviteLink);

          return NextResponse.json({
            success: true,
            message: 'Convite aceito e enviado com sucesso!',
            inviteToken: generatedToken,
            inviteLink
          });
        } catch (error) {
          console.error('Erro ao processar convite:', error);
          return NextResponse.json(
            { error: 'Erro ao processar o convite' },
            { status: 500 }
          );
        }

      } else if (action === 'REJECT') {
        // Atualizar status para fechado
        await prisma.contact.update({
          where: { id: contactId },
          data: { 
            status: 'CLOSED',
            updatedAt: new Date()
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Solicitação de convite rejeitada'
        });

      } else {
        return NextResponse.json(
          { error: 'Ação inválida. Use ACCEPT ou REJECT' },
          { status: 400 }
        );
      }

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao processar ação do convite:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para gerar token único de convite
function generateInviteToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// Função para envio de email (simulada - integre com seu provedor)
async function sendInviteEmail(email: string, name: string, inviteLink: string) {
  // Aqui você integraria com um serviço real de email
  // Por exemplo: SendGrid, Nodemailer, AWS SES, etc.
  
  const emailContent = {
    to: email,
    subject: 'Bem-vindo à TopCars Valley - Seu Convite Está Aqui!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #DC2626; font-size: 28px; margin: 0;">TopCars Valley</h1>
          <p style="color: #9CA3AF; margin: 10px 0;">Comunidade Premium de Carros Esportivos</p>
        </div>
        
        <h2 style="color: #fff; margin-bottom: 20px;">Olá, ${name}!</h2>
        
        <p style="line-height: 1.6; margin-bottom: 20px;">
          Parabéns! Sua solicitação de convite para a TopCars Valley foi <strong style="color: #DC2626;">aprovada</strong>!
        </p>
        
        <p style="line-height: 1.6; margin-bottom: 30px;">
          Você agora faz parte de uma comunidade exclusiva de entusiastas de carros esportivos. 
          Clique no botão abaixo para completar seu cadastro:
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${inviteLink}" 
             style="background-color: #DC2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Completar Cadastro
          </a>
        </div>
        
        <p style="font-size: 14px; color: #9CA3AF; margin-top: 30px;">
          Este convite é válido por 7 dias. Se você não conseguir clicar no botão, copie e cole o link abaixo no seu navegador:
        </p>
        <p style="font-size: 12px; color: #6B7280; word-break: break-all; background-color: #262626; padding: 10px; border-radius: 4px;">
          ${inviteLink}
        </p>
      </div>
    `
  };

  console.log('Email que seria enviado:', emailContent);
  
  // Aqui você faria a integração real:
  // await emailService.send(emailContent);
  
  return true;
}
