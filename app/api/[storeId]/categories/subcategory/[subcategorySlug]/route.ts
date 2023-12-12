import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { subcategorySlug: string; id: string } }
) {
  try {
    if (!params.subcategorySlug) {
      return new NextResponse("Slug Required", { status: 400 });
    }

    const category = await prismadb.subcategory.findUnique({
      where: {
        slug: params.subcategorySlug,
      },
      include: {
        products: {
          include: { images: true },
        },
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[SUBCATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
