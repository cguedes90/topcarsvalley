import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            rsvps: {
              where: {
                status: 'CONFIRMED'
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Transform events to include currentParticipants
    const eventsWithParticipants = events.map((event: any) => ({
      ...event,
      currentParticipants: event._count.rsvps
    }))

    return NextResponse.json({ events: eventsWithParticipants })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        shortDescription: body.shortDescription,
        date: new Date(body.date),
        time: body.time,
        location: body.location,
        maxParticipants: parseInt(body.maxParticipants),
        category: body.category,
        price: body.price,
        isPublic: body.isPublic ?? true,
        isActive: body.isActive ?? true,
        image: body.image,
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
