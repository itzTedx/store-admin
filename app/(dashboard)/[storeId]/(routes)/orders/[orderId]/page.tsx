import Currency from "@/components/ui/currency";
import { Heading } from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";

const OrderPage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const orders = await prismadb.order.findFirst({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: true,
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      id: { in: orders?.orderItems.map((item) => item.productId) },
    },
    include: {
      color: true,
      size: true,
      category: true,
    },
  });
  const price = products.map((item) => item.price);

  const totalPrice = price.reduce((total, item) => {
    return total + Number(item);
  }, 0);

  const taxPrice = totalPrice * 0.05;

  const grandTotal = taxPrice + totalPrice;

  return (
    <div className="flex-1 p-8 pt-6 space-y-4">
      <Heading title="Order" description={`Order Id: ${orders?.id}`} />
      Payment Status: {orders?.isPaid ? "Paid" : "Pending"}
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <span>{product.category.name}</span>
          <span>{product.color.name}</span>
          <span>{product.size.name}</span>
          <div>{product.price.toString()}</div>
        </div>
      ))}
      <Currency value={totalPrice} />
      <Currency value={taxPrice} />
      <Currency value={grandTotal} />
    </div>
  );
};

export default OrderPage;
