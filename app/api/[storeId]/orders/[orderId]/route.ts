import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order ID Required", { status: 400 });
    }
    const orders = await prismadb.order.findUnique({
      where: { id: params.orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
