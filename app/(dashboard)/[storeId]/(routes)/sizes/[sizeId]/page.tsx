import prismadb from "@/lib/prismadb";

import { SizeForm } from "./components/size-form";

const SizePage = async ({
  params,
}: {
  params: { storeId: string; sizeId: string };
}) => {
  const sizes = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeForm initialData={sizes} />
      </div>
    </div>
  );
};

export default SizePage;
