import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando migração de carros do perfil para a garagem...');

    // Buscar todos os usuários que têm dados de carro no perfil mas não têm veículos na garagem
    const usersWithProfileCars = await prisma.user.findMany({
      where: {
        profile: {
          AND: [
            { carBrand: { not: null } },
            { carModel: { not: null } },
            { carYear: { not: null } }
          ]
        }
      },
      include: {
        profile: true,
        vehicles: true
      }
    });

    console.log(`📊 Encontrados ${usersWithProfileCars.length} usuários com carros no perfil`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of usersWithProfileCars) {
      if (!user.profile) continue;

      // Verificar se já tem um veículo com os mesmos dados
      const existingVehicle = await prisma.vehicle.findFirst({
        where: {
          ownerId: user.id,
          brand: user.profile.carBrand!,
          model: user.profile.carModel!,
          year: user.profile.carYear!
        }
      });

      if (existingVehicle) {
        console.log(`⏭️ Usuário ${user.email} já tem o veículo na garagem, pulando...`);
        skippedCount++;
        continue;
      }

      // Criar o veículo na garagem
      try {
        await prisma.vehicle.create({
          data: {
            brand: user.profile.carBrand!,
            model: user.profile.carModel!,
            year: user.profile.carYear!,
            color: 'Não informado',
            fuelType: 'Gasolina',
            description: `${user.profile.carBrand} ${user.profile.carModel} ${user.profile.carYear} migrado do perfil`,
            photos: [],
            isPublic: true,
            ownerId: user.id,
          }
        });

        console.log(`✅ Veículo migrado para ${user.email}: ${user.profile.carBrand} ${user.profile.carModel} ${user.profile.carYear}`);
        migratedCount++;

      } catch (vehicleError) {
        console.error(`❌ Erro ao migrar veículo para ${user.email}:`, vehicleError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migração concluída! ${migratedCount} veículos migrados, ${skippedCount} já existiam.`,
      details: {
        migrated: migratedCount,
        skipped: skippedCount,
        total: usersWithProfileCars.length
      }
    });

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
