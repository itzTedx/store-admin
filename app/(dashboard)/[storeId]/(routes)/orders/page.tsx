import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import OrderClient from "./components/order-client"
import { OrderColumn } from "./components/columns"
import { formatter } from "@/lib/utils"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders",
}

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    storeId: params.storeId,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.discountPrice)
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4 ">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage
