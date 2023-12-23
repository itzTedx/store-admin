"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import Image from "next/image";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
  imageUrl: string;
  description: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div className="relative h-10 aspect-video">
          <Image
            src={row.original.imageUrl}
            fill
            alt="Label"
            className="object-cover rounded-sm"
          />
        </div>
        <div className="">
          <h5>{row.original.label}</h5>
          <p className="max-w-sm text-xs text-gray-500 truncate">
            {row.original.description}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
