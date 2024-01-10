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
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: {
      size: true,
      quantity: true,
      subcategory: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  //  item.discountPrice
  //    ? item.discountPrice.toNumber()
  //    : item.actualPrice.toNumber();

  const formattedProducts: ProductColumn[] = products.map((item) => {
    const discountPrice = item.discountPrice?.toNumber();

    const price = discountPrice === 0 ? item.actualPrice : item.discountPrice;
    return {
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(
        price ? price.toNumber() : item.actualPrice.toNumber()
      ),
      subcategory: item.subcategory?.name,
      image: item.images[0].url,
      size: item.size.name,
      color: item.quantity.value,
      createdAt: format(item.createdAt, "MM/dd/yyyy"),
      storeId: params.storeId,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4 ">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
