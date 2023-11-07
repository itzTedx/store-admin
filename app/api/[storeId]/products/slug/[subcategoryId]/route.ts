import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { subcategoryId: string } }
) {
  console.log(params);

  try {
    if (!params.subcategoryId) {
      return new NextResponse("Item Required", { status: 404 });
    }

    const product = await prismadb.product.findMany({
      where: {
        subcategoryId: params.subcategoryId,
      },
      include: {
        subcategory: true,
        size: true,
        quantity: true,
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
