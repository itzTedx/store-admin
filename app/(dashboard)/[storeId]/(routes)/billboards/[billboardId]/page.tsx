import prismadb from '@/lib/prismadb'
import { BillboardForm } from './component/billboard-form'

const BillboardNewPage = async ({
  params,
}: {
  params: { billboardId: string }
}) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  })

  return (
    <>
      <div className='flex-col'>
        <div className='flex-1 p-8 pt-6 space-y-4'>
          <BillboardForm initialData={billboard}></BillboardForm>
        </div>
      </div>
    </>
  )
}

export default BillboardNewPage
