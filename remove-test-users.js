import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeTestUsers() {
  try {
    console.log('🗑️ Removendo usuários de teste...');
    
    // Emails dos usuários para remover
    const testEmails = [
      'ana.costa@email.com',
      'joao.oliveira@email.com',
      'maria.santos@email.com',
      'carlos.silva@email.com'
    ];
    
    // Remover perfis primeiro (por causa da relação)
    await prisma.userProfile.deleteMany({
      where: {
        user: {
          email: {
            in: testEmails
          }
        }
      }
    });
    
    // Remover usuários
    const result = await prisma.user.deleteMany({
      where: {
        email: {
          in: testEmails
        }
      }
    });
    
    console.log(`✅ Removidos ${result.count} usuários de teste`);
    
    // Verificar usuários restantes
    const remainingUsers = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true
      }
    });
    
    console.log('\n👥 Usuários restantes:');
    remainingUsers.forEach(user => {
      console.log(`- ${user.name || 'Sem nome'} (${user.email}) - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao remover usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeTestUsers();
