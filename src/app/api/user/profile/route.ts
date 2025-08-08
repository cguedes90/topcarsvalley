import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        profile: {
          select: {
            birthDate: true,
            cep: true,
            city: true,
            state: true,
            carBrand: true,
            carModel: true,
            carYear: true,
            bio: true,
            avatar: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const birthDate = formData.get('birthDate') as string;
    const cep = formData.get('cep') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const carBrand = formData.get('carBrand') as string;
    const carModel = formData.get('carModel') as string;
    const carYear = formData.get('carYear') as string;
    const bio = formData.get('bio') as string;
    const avatar = formData.get('avatar') as File;

    let avatarPath = null;

    // Handle avatar upload
    if (avatar && avatar.size > 0) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const timestamp = Date.now();
      const extension = path.extname(avatar.name);
      const filename = `avatar_${decoded.userId}_${timestamp}${extension}`;
      
      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
      
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, ignore error
      }

      // Save file
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      
      avatarPath = `/uploads/avatars/${filename}`;
    }

    // Update user data
    const userData: any = {};
    if (name) userData.name = name;
    if (phone) userData.phone = phone;

    // Prepare profile data
    const profileData: any = {};
    if (birthDate) profileData.birthDate = new Date(birthDate);
    if (cep) profileData.cep = cep;
    if (city) profileData.city = city;
    if (state) profileData.state = state;
    if (carBrand) profileData.carBrand = carBrand;
    if (carModel) profileData.carModel = carModel;
    if (carYear) profileData.carYear = parseInt(carYear);
    if (bio !== undefined) profileData.bio = bio;
    if (avatarPath) profileData.avatar = avatarPath;

    // Update user and profile
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...userData,
        profile: {
          upsert: {
            create: profileData,
            update: profileData,
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profile: {
          select: {
            birthDate: true,
            cep: true,
            city: true,
            state: true,
            carBrand: true,
            carModel: true,
            carYear: true,
            bio: true,
            avatar: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso!',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
