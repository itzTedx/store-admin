import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    if (!params.slug) {
      return new NextResponse("Store ID Required", { status: 400 })
    }

    const product = await prismadb.product.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        images: true,
        subcategory: {
          include: {
            products: {
              include: {
                images: true,
              },
            },
          },
        },
        size: true,
        quantity: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
