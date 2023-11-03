import prismadb from "@/lib/prismadb";

import { QuantityForm } from "./components/quantity-form";

const ColorPage = async ({
  params,
}: {
  params: { storeId: string; quantityId: string };
}) => {
  const sizes = await prismadb.quantity.findUnique({
    where: {
      id: params.quantityId,
    },
  });

  console.log(sizes);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <QuantityForm initialData={sizes} />
      </div>
    </div>
  );
};

export default ColorPage;
