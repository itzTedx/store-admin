import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { formatSlug } from "@/lib/utils";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      description,
      actualPrice,
      discountPrice,
      subcategoryId,
      sizeId,
      quantityId,
      timeFrame,
      metaTitle,
      metaDescription,
      metaKeywords,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("At least one image is required", {
        status: 400,
      });
    }

    if (!actualPrice) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size is required", { status: 400 });
    }

    if (!quantityId) {
      return new NextResponse("Quantity is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const slug = formatSlug(name);
    const products = await prismadb.product.create({
      data: {
        name,
        slug,
        description,
        actualPrice,
        discountPrice,
        subcategoryId,
        metaTitle,
        metaDescription,
        metaKeywords,
        sizeId,
        quantityId,
        isFeatured,
        timeFrame,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const subcategoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        subcategoryId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        subcategory: true,
        size: true,
        quantity: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
