import prismadb from "@/lib/prismadb";
import ProfileForm from "./_components/category-form";
import TestFn from "./_components/text-fu";
import { AccountForm } from "./_components/account-form";

const TestPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const categories = await prismadb.subcategory.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(categories);
  return (
    <div>
      <AccountForm categories={categories} />
      <ProfileForm billboards={billboards} initialData={null} />
      <TestFn billboards={billboards} />
    </div>
  );
};

export default TestPage;
