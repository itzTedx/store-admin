import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import CategoriesClient from "./components/category-client";
import { CategoryColumn } from "./components/columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    include: {
      billboard: true,
      subcategory: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    subcategory: item.subcategory.map((category) => category.name).join(", "),
    billboardLabel: item.billboard.label,
    billboardImage: item.billboard.imageUrl,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4 ">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
