import { CreditCard, DollarSign } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";

import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { getGraphRevenue } from "@/actions/getGraphRevenue";
import { getSalesCount } from "@/actions/getSalesCount";
import { getTotalRevenue } from "@/actions/getTotalRevenue";

import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(
  { params }: DashboardPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.storeId;

  // fetch data
  const store = await prismadb.store.findFirst({
    where: {
      id,
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
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);

  const products = await prismadb.product.findMany({
    include: { images: true },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-4 sm:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatter.format(totalRevenue)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{salesCount}</div>
                </CardContent>
              </Card>
            </div>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphRevenue} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Products</span>
                <Button asChild>
                  <Link href={`/${params.storeId}/products/new`}>Add New</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {products.slice(0, 9).map((product) => (
                <li key={product.id} className="flex items-center gap-2 py-1">
                  <div className="relative w-14 h-14 shrink-0">
                    <Image
                      src={product.images[0].url}
                      fill
                      alt={product.name}
                      className="object-cover"
                    />
                  </div>

                  <span className="text-sm">{product.name}</span>
                </li>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
