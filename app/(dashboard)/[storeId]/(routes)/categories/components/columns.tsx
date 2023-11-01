"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import Image from "next/image"

export type CategoryColumn = {
  id: string
  name: string
  subcategory: string
  billboardLabel: string
  billboardImage: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "subcategory",
    header: "Sub Category",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div className="relative h-8 aspect-video">
          <Image
            src={row.original.billboardImage}
            fill
            alt="Label"
            className="object-cover rounded-sm"
          />
        </div>
        <div className="">
          <h5>{row.original.billboardLabel}</h5>
        </div>
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
