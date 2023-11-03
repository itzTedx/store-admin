import prismadb from "@/lib/prismadb";

import { QuantityForm } from "./components/quantity-form";

const QuantityPage = async ({
  params,
}: {
  params: { storeId: string; quantityId: string };
}) => {
  const quantity = await prismadb.quantity.findUnique({
    where: {
      id: params.quantityId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <QuantityForm initialData={quantity} />
      </div>
    </div>
  );
};

export default QuantityPage;
