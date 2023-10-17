'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { CheckCircle, Minus, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  size: string
  color: string
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <h5 className='font-semibold'>{row.original.name}</h5>,
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    cell: ({ row }) =>
      row.original.isFeatured ? (
        <CheckCircle className='w-5 h-5 mx-3 stroke-green-500 fill-green-200' />
      ) : (
        <X className='w-5 h-5 mx-3 stroke-neutral-500' />
      ),
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived',
    cell: ({ row }) =>
      row.original.isArchived ? (
        <CheckCircle className='w-5 h-5 mx-3 stroke-red-500 fill-red-200' />
      ) : (
        <X className='w-5 h-5 mx-3 stroke-neutral-500' />
      ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className='mx-3'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className='w-6 h-6 border rounded-full'
                style={{ backgroundColor: row.original.color }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.color}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
