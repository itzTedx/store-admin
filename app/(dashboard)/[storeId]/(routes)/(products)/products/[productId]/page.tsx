import prismadb from "@/lib/prismadb"

import { ProductForm } from "./components/product-form"

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string }
}) => {
  const products = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
      category: true,
    },
  })



  const categories = await prismadb.category.findMany({
    include: {
      subcategory: {
        select: { name: true, id: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  })
  const colors = await prismadb.quantity.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductForm
          initialData={products}
          categories={categories}
          sizes={sizes}
          quantity={colors}
        />
      </div>
    </div>
  )
}

export default ProductPage
