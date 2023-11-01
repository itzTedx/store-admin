import prismadb from "@/lib/prismadb"

import { ColorForm } from "./components/color-form"

const ColorPage = async ({
  params,
}: {
  params: { storeId: string; colorId: string }
}) => {
  const sizes = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  })

  console.log(sizes)

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorForm initialData={sizes} />
      </div>
    </div>
  )
}

export default ColorPage
