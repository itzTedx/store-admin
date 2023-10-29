import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { MainNav } from '@/components/MainNav'
import StoreSwitcher from './store-switcher'
import prismadb from '@/lib/prismadb'
import { ModeToggle } from './theme-toggle'

const Navbar = async () => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  })

  return (
    <div className='border-b'>
      <div className='flex items-center w-full h-16 px-2 overflow-hidden md:px-4'>
        <StoreSwitcher className='' items={stores} />
        <MainNav className='py-5 mx-6 overflow-x-auto ' />
        <div className='flex items-center ml-auto space-x-4'>
          <ModeToggle />
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </div>
  )
}

export default Navbar
