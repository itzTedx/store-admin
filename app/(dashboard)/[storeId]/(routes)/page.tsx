import prismadb from "@/lib/prismadb";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: DashboardPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.storeId;

  // fetch data
  const store = await await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return {
    title: store?.name + " - Overview",
  };
}

interface DashboardPageProps {
  params: { storeId: string };
}
const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return <div>Active Store: {store?.name}</div>;
};

export default DashboardPage;
