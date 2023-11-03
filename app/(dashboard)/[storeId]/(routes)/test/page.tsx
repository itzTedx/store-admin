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
  const categories = await prismadb.category.findMany({
    include: {
      subcategory: {
        select: { name: true, id: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="grid grid-cols-3 py-6">
      <div>
        {categories.map((cat) => (
          <div key={cat.id}>
            <h5 className="font-bold">{cat.name}</h5>
            {cat.subcategory.map((sub) => (
              <div key={sub.name}>{sub.name}</div>
            ))}
          </div>
        ))}
      </div>
      <AccountForm categories={categories} />
      {/* <ProfileForm billboards={billboards} initialData={null} /> */}
      <TestFn billboards={billboards} />
    </div>
  );
};

export default TestPage;
