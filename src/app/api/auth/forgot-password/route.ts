import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por segurança, não revelamos que o email não existe
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      });
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Por enquanto, vamos simular o salvamento do token
    // Em produção, você precisará fazer o deploy da migration primeiro
    // await prisma.user.update({
    //   where: { email },
    //   data: {
    //     resetToken,
    //     resetTokenExpiry
    //   }
    // });
    
    console.log('Token gerado para', email, ':', resetToken);

    // Configurar transporter do Zoho
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/esqueci-senha?token=${resetToken}`;

    // Template do email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir Senha - TopCars Valley</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  line-height: 1.6;
                  color: #ffffff;
                  background: linear-gradient(135deg, #000000 0%, #262626 50%, #404040 100%);
                  margin: 0;
                  padding: 20px;
              }
              
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: linear-gradient(135deg, rgba(38, 38, 38, 0.95) 0%, rgba(64, 64, 64, 0.85) 100%);
                  border-radius: 20px;
                  overflow: hidden;
                  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                  border: 1px solid rgba(82, 82, 82, 0.3);
              }
              
              .header {
                  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
                  padding: 40px 30px;
                  text-align: center;
                  position: relative;
                  overflow: hidden;
              }
              
              .header::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                  opacity: 0.3;
              }
              
              .logo {
                  position: relative;
                  z-index: 2;
                  margin-bottom: 20px;
              }
              
              .logo svg {
                  width: 60px;
                  height: 60px;
                  fill: white;
                  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
              }
              
              .header h1 {
                  font-family: 'Orbitron', monospace;
                  font-size: 28px;
                  font-weight: 800;
                  margin: 15px 0;
                  position: relative;
                  z-index: 2;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
              }
              
              .header .subtitle {
                  font-size: 16px;
                  opacity: 0.95;
                  position: relative;
                  z-index: 2;
                  font-weight: 500;
              }
              
              .content {
                  padding: 40px 30px;
              }
              
              .greeting {
                  font-size: 20px;
                  font-weight: 600;
                  margin-bottom: 25px;
                  color: #ffffff;
              }
              
              .message {
                  font-size: 16px;
                  margin-bottom: 30px;
                  color: #e5e5e5;
                  line-height: 1.8;
              }
              
              .reset-card {
                  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%);
                  border: 2px solid rgba(220, 38, 38, 0.3);
                  border-radius: 16px;
                  padding: 25px;
                  margin: 30px 0;
                  text-align: center;
              }
              
              .reset-icon {
                  width: 50px;
                  height: 50px;
                  background: rgba(220, 38, 38, 0.2);
                  border-radius: 50%;
                  margin: 0 auto 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              
              .reset-card h2 {
                  font-family: 'Orbitron', monospace;
                  font-size: 18px;
                  font-weight: 700;
                  margin-bottom: 15px;
                  color: #DC2626;
              }
              
              .reset-card p {
                  color: #cccccc;
                  margin-bottom: 25px;
                  font-size: 14px;
              }
              
              .cta-button {
                  display: inline-block;
                  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
                  color: white !important;
                  text-decoration: none;
                  padding: 16px 35px;
                  border-radius: 12px;
                  font-weight: 700;
                  font-size: 16px;
                  transition: all 0.3s ease;
                  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
                  border: 2px solid transparent;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  font-family: 'Inter', sans-serif;
              }
              
              .cta-button:hover {
                  background: linear-gradient(135deg, #B91C1C 0%, #991B1B 100%);
                  transform: translateY(-2px);
                  box-shadow: 0 12px 35px rgba(220, 38, 38, 0.6);
              }
              
              .security-note {
                  background: rgba(82, 82, 82, 0.2);
                  border-left: 4px solid #DC2626;
                  padding: 20px;
                  margin: 30px 0;
                  border-radius: 8px;
              }
              
              .security-note h3 {
                  color: #DC2626;
                  font-size: 16px;
                  font-weight: 600;
                  margin-bottom: 10px;
              }
              
              .security-note p {
                  color: #cccccc;
                  font-size: 14px;
                  line-height: 1.6;
              }
              
              .footer {
                  background: rgba(0, 0, 0, 0.3);
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid rgba(82, 82, 82, 0.3);
              }
              
              .footer p {
                  color: #999999;
                  font-size: 13px;
                  margin-bottom: 15px;
              }
              
              .footer .brand {
                  font-family: 'Orbitron', monospace;
                  font-weight: 700;
                  color: #DC2626;
                  text-decoration: none;
                  font-size: 14px;
              }
              
              .footer .contact {
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid rgba(82, 82, 82, 0.3);
              }
              
              .footer .contact a {
                  color: #DC2626;
                  text-decoration: none;
                  font-weight: 500;
              }
              
              .footer .contact a:hover {
                  color: #ffffff;
              }
              
              @media only screen and (max-width: 600px) {
                  body {
                      padding: 10px;
                  }
                  
                  .header, .content, .footer {
                      padding: 25px 20px;
                  }
                  
                  .header h1 {
                      font-size: 24px;
                  }
                  
                  .cta-button {
                      display: block;
                      text-align: center;
                      margin: 20px 0;
                      padding: 18px 25px;
                  }
                  
                  .reset-card {
                      padding: 20px 15px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                  </div>
                  <h1>TopCars Valley</h1>
                  <div class="subtitle">Redefinição de Senha</div>
              </div>
              
              <div class="content">
                  <div class="greeting">
                      Olá, ${user.name}!
                  </div>
                  
                  <div class="message">
                      Recebemos uma solicitação para redefinir a senha da sua conta na <strong>TopCars Valley</strong>.
                      Se você fez esta solicitação, clique no botão abaixo para criar uma nova senha.
                  </div>
                  
                  <div class="reset-card">
                      <div class="reset-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#DC2626">
                              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8V10H5A2,2 0 0,0 3,12V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V12A2,2 0 0,0 19,10H18V8M12,4A4,4 0 0,1 16,8V10H8V8A4,4 0 0,1 12,4Z"/>
                          </svg>
                      </div>
                      <h2>Redefinir Senha</h2>
                      <p>Clique no botão abaixo para criar sua nova senha. Este link expira em 1 hora.</p>
                      <a href="${resetUrl}" class="cta-button">
                          Redefinir Minha Senha
                      </a>
                  </div>
                  
                  <div class="security-note">
                      <h3>🔒 Importante para sua Segurança</h3>
                      <p>
                          • Este link expira em <strong>1 hora</strong><br>
                          • Se você não solicitou esta redefinição, ignore este email<br>
                          • Nunca compartilhe este link com outras pessoas<br>
                          • Use uma senha forte com pelo menos 8 caracteres
                      </p>
                  </div>
                  
                  <div class="message">
                      Se você não conseguir clicar no botão, copie e cole o link abaixo no seu navegador:
                      <br><br>
                      <span style="color: #DC2626; word-break: break-all; font-size: 14px;">${resetUrl}</span>
                  </div>
              </div>
              
              <div class="footer">
                  <p>Esta é uma mensagem automática da <strong>TopCars Valley</strong></p>
                  <a href="${process.env.NEXTAUTH_URL}" class="brand">topcarsvalley.com</a>
                  
                  <div class="contact">
                      <p>
                          Precisa de ajuda? Entre em contato: 
                          <a href="mailto:contato@inovamentelabs.com.br">contato@inovamentelabs.com.br</a>
                      </p>
                      <p style="margin-top: 15px; font-size: 11px; color: #666;">
                          Desenvolvido por <a href="https://inovamentelabs.com.br" style="color: #DC2626;">InovaMente Labs</a>
                      </p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    // Enviar email
    await transporter.sendMail({
      from: {
        name: 'TopCars Valley',
        address: process.env.SMTP_USER!
      },
      to: user.email,
      subject: 'Redefinir Senha - TopCars Valley',
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Link de redefinição enviado para seu email!'
    });

  } catch (error) {
    console.error('Erro no forgot-password:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
