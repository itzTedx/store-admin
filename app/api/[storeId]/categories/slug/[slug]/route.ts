import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    if (!params.slug) {
      return new NextResponse("Slug Required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        slug: params.slug,
      },
      include: { billboard: true, subcategory: true },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
