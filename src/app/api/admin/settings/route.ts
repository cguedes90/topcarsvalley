import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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

      // Por enquanto, retornamos configurações padrão
      // Em uma implementação real, isso viria de um banco de dados
      const settings = {
        email: {
          smtpHost: process.env.SMTP_HOST || 'smtppro.zoho.com',
          smtpPort: parseInt(process.env.SMTP_PORT || '587'),
          smtpUser: process.env.SMTP_USER || 'contato@inovamentelabs.com.br',
          smtpPassword: '••••••••', // Mascarar senha por segurança
          fromEmail: process.env.SMTP_FROM || 'contato@inovamentelabs.com.br',
          fromName: 'TopCars Valley'
        },
        general: {
          siteName: 'TopCars Valley',
          siteDescription: 'Comunidade premium de entusiastas automotivos',
          maintenanceMode: false,
          registrationEnabled: true,
          inviteOnlyMode: true,
          maxMembersPerEvent: 50
        },
        features: {
          garageFunctionEnabled: true,
          communityFunctionEnabled: true,
          eventRSVPEnabled: true,
          contactFormEnabled: true,
          partnershipEnabled: true
        },
        security: {
          passwordMinLength: 8,
          sessionTimeout: 24, // horas
          maxLoginAttempts: 5,
          requireEmailVerification: true
        }
      };

      return NextResponse.json({
        success: true,
        settings
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
          { error: 'Acesso negado. Apenas administradores podem alterar configurações.' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const { settings } = body;

      // Em uma implementação real, salvaria no banco de dados
      // Por enquanto, apenas retornamos sucesso
      console.log('Configurações atualizadas:', settings);

      return NextResponse.json({
        success: true,
        message: 'Configurações atualizadas com sucesso'
      });

    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
