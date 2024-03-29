import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const category = await prismadb.subcategory.findFirst({
      include: {
        category: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[SUBCATEGORY_GET_ALL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
