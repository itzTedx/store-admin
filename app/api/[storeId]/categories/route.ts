import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const { name, billboardId, subcategory } = body

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }
    if (!billboardId) {
      return new NextResponse("Billboard is required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    // Remove special characters and symbols
    const cleanName = name.replace(/[^\w\s-]/g, "")
    // Replace spaces with dashes and convert to lowercase
    const slug = cleanName.replace(/\s+/g, "-").toLowerCase()

    const category = await prismadb.category.create({
      data: {
        name,
        slug,
        billboardId,
        storeId: params.storeId,
        subcategory: {
          createMany: {
            data: [...subcategory.map((item: { name: string }) => item)],
          },
        },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORIES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 })
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.log("[CATEGORIES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
