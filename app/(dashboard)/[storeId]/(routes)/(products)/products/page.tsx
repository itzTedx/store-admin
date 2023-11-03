import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import ProductClient from "./components/product-client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: {
      size: true,
      quantity: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = billboards.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(
      item.discountPrice
        ? item.discountPrice.toNumber()
        : item.actualPrice.toNumber()
    ),
    category: item.subcategoryId,
    size: item.size.name,
    color: item.quantity.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4 ">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;