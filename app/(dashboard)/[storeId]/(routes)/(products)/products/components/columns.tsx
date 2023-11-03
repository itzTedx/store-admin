"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, ArrowUpDown, X } from "lucide-react";

import CellAction from "./cell-action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => <h5 className="font-semibold">{row.original.name}</h5>,
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) =>
      row.original.isFeatured ? (
        <CheckCircle className="w-5 h-5 mx-3 stroke-green-500 fill-green-200" />
      ) : (
        <X className="w-5 h-5 mx-3 stroke-neutral-500" />
      ),
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) =>
      row.original.isArchived ? (
        <CheckCircle className="w-5 h-5 mx-3 stroke-red-500 fill-red-200" />
      ) : (
        <X className="w-5 h-5 mx-3 stroke-neutral-500" />
      ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
