import prismadb from "@/lib/prismadb"
import ProfileForm from "./_components/category-form"
import TestFn from "./_components/text-fu"
import { AccountForm } from "./_components/account-form"

const TestPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  const categories = await prismadb.category.findMany({
    include: {
      subcategory: {
        select: { name: true, id: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  return (
    <div className="grid py-6 sm:grid-cols-3">
      <AccountForm categories={categories} />
      {/* <ProfileForm billboards={billboards} initialData={null} /> */}
      <div className="px-6">
        Sluggify Test
        <TestFn string="hello I'm Mukesh and my email is mukesh@gmail.com" />
      </div>
    </div>
  )
}

export default TestPage
