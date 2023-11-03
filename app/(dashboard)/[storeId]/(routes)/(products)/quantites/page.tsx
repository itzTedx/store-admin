import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import QuantityClient from "./components/client";
import { ColorColumn } from "./components/columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colors",
};

const QuantitesPage = async ({ params }: { params: { storeId: string } }) => {
  const quantites = await prismadb.quantity.findMany({
    where: { storeId: params.storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = quantites.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4 ">
        <QuantityClient data={formattedColors} />
      </div>
    </div>
  );
};

export default QuantitesPage;
