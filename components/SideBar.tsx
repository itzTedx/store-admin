"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { Separator } from "./ui/separator";

const SideBar = () => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/quantites`,
      label: "Quantities",
      active: pathname === `/${params.storeId}/quantites`,
    },
    {
      href: `/${params.storeId}/test`,
      label: "Test",
      active: pathname === `/${params.storeId}/test`,
    },
  ];

  return (
    <aside className="flex flex-col w-[220px] border-r gap-1 p-3 ">
      {routes.map((route) => (
        <>
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary  hover:bg-muted-foreground/10 py-4 px-3 rounded-md",
              route.active
                ? "text-black dark:text-white font-medium"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
          <Separator />
        </>
      ))}
    </aside>
  );
};

export default SideBar;
