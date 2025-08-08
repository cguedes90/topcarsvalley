import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando migração de carros do perfil para a garagem...');

    // Buscar todos os usuários que têm dados de carro no perfil
    const usersWithProfileCars = await prisma.user.findMany({
      where: {
        profile: {
          carBrand: { not: null },
          carModel: { not: null },
          carYear: { not: null }
        }
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            carBrand: true,
            carModel: true,
            carYear: true
          }
        }
      }
    });

    console.log(`📊 Encontrados ${usersWithProfileCars.length} usuários com carros no perfil`);

    let migratedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const user of usersWithProfileCars) {
      if (!user.profile) continue;

      try {
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
        errors.push({
          user: user.email,
          error: vehicleError instanceof Error ? vehicleError.message : 'Erro desconhecido'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migração concluída! ${migratedCount} veículos migrados, ${skippedCount} já existiam.`,
      details: {
        migrated: migratedCount,
        skipped: skippedCount,
        total: usersWithProfileCars.length,
        errors: errors
      }
    });

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
