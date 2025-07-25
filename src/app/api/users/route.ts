import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, role, companyName, ueiNumber, socioEconomicStatus } = body

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        companyName,
        ueiNumber,
        socioEconomicStatus: socioEconomicStatus || []
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    console.log('Looking up user with email:', email)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('User found:', user ? 'Yes' : 'No', user?.email, user?.role)

    if (!user) {
      console.log('User not found in database')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error finding user:', error)
    return NextResponse.json(
      { error: 'Failed to find user' },
      { status: 500 }
    )
  }
}