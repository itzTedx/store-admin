import prismadb from "@/lib/prismadb";
import ProfileForm from "./_components/category-form";

const TestPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div>
      <ProfileForm billboards={billboards} initialData={null} />
    </div>
  );
};

export default TestPage;
