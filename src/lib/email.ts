import nodemailer from 'nodemailer';

// Configuração do transporter Zoho
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // false para 587, true para 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendInviteEmailParams {
  to: string;
  name: string;
  inviteToken: string;
}

export async function sendInviteEmail({ to, name, inviteToken }: SendInviteEmailParams) {
  const inviteUrl = `${process.env.NEXTAUTH_URL}/aceitar-convite/${inviteToken}`;
  
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Convite TopCars Valley</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Inter', Arial, sans-serif;
                background-color: #0f0f0f;
                color: #ffffff;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #262626;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #404040;
            }
            .header {
                background: linear-gradient(135deg, #dc2626, #991b1b);
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                font-family: 'Orbitron', monospace;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #ffffff;
            }
            .message {
                font-size: 16px;
                color: #d1d5db;
                margin-bottom: 30px;
                line-height: 1.8;
            }
            .highlight {
                color: #dc2626;
                font-weight: 600;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #dc2626, #991b1b);
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                transition: all 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
            }
            .features {
                background-color: #1f1f1f;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
                border-left: 4px solid #dc2626;
            }
            .features h3 {
                color: #dc2626;
                font-size: 18px;
                margin-bottom: 15px;
                font-family: 'Orbitron', monospace;
            }
            .features ul {
                list-style: none;
                padding: 0;
            }
            .features li {
                padding: 8px 0;
                color: #d1d5db;
                position: relative;
                padding-left: 24px;
            }
            .features li::before {
                content: "🏎️";
                position: absolute;
                left: 0;
            }
            .footer {
                background-color: #1f1f1f;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #404040;
            }
            .footer p {
                color: #9ca3af;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .footer .small {
                font-size: 12px;
                color: #6b7280;
                margin-top: 15px;
            }
            .logo {
                font-size: 24px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏎️</div>
                <h1>TopCars Valley</h1>
                <p>Comunidade Premium de Entusiastas Automotivos</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Olá${name ? ` ${name}` : ''}! 👋
                </div>
                
                <div class="message">
                    Você foi <span class="highlight">selecionado exclusivamente</span> para fazer parte da <strong>TopCars Valley</strong>, 
                    a comunidade mais prestigiada de entusiastas de carros esportivos do Brasil.
                </div>
                
                <div class="features">
                    <h3>🏁 O que te espera na TopCars Valley:</h3>
                    <ul>
                        <li>Eventos exclusivos com supercarros</li>
                        <li>Networking com colecionadores</li>
                        <li>Track days em autódromos renomados</li>
                        <li>Encontros temáticos mensais</li>
                        <li>Acesso a lançamentos em primeira mão</li>
                        <li>Comunidade seleta e apaixonada</li>
                    </ul>
                </div>
                
                <div class="message">
                    Para completar seu cadastro e garantir sua vaga nesta comunidade exclusiva, 
                    clique no botão abaixo e finalize seu perfil:
                </div>
                
                <div style="text-align: center;">
                    <a href="${inviteUrl}" class="cta-button">
                        🚀 Finalizar Cadastro
                    </a>
                </div>
                
                <div class="message">
                    <strong>⚠️ Importante:</strong> Este convite é pessoal e intransferível. 
                    Você terá <span class="highlight">7 dias</span> para completar seu cadastro.
                </div>
            </div>
            
            <div class="footer">
                <p><strong>TopCars Valley</strong></p>
                <p>A paixão por carros esportivos nos une</p>
                <div class="small">
                    Se você não solicitou este convite, pode ignorar este email com segurança.
                    <br>Este é um email automático, não responda.
                    <br><br>
                    Desenvolvido por <a href="https://inovamentelabs.com.br" style="color: #dc2626; text-decoration: none;">InovaMente Labs</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

    try {
      await transporter.sendMail({
        from: {
          name: 'TopCars Valley',
          address: process.env.SMTP_USER || 'contato@inovamentelabs.com.br',
        },
        to: to,
        subject: '🏎️ Você foi convidado para a TopCars Valley - Comunidade Premium',
        html: emailTemplate,
      });    console.log(`Email de convite enviado para: ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: error };
  }
}

// Função de teste para verificar conexão
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Conexão SMTP estabelecida com sucesso');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro na conexão SMTP:', error);
    return { success: false, error };
  }
}
