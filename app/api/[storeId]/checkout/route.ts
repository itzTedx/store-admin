import { NextResponse } from "next/server";
import Stripe from "stripe";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      images: true,
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    const discountPrice = product.discountPrice?.toNumber();

    const price = discountPrice ? product.discountPrice : product.actualPrice;

    line_items.push({
      quantity: 1,

      price_data: {
        currency: "AED",
        tax_behavior: "exclusive",
        product_data: {
          name: product.name,
          description: product.description,
          images: product.images.map((image) => image.url),
          tax_code: "txcd_20090028",
        },

        unit_amount: price
          ? price.toNumber() * 100
          : product.actualPrice.toNumber() * 100,
        // unit_amount: product.discountPrice?.eq(0)
        //   ? product.actualPrice.toNumber() * 100
        //   : product.discountPrice.toNumber() * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    automatic_tax: {
      enabled: true,
    },

    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1&orderId=${order.id}`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
