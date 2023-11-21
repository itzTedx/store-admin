import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function GET(req: Request) {
  try {
    const orders = await prismadb.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.log('[SIZE_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
