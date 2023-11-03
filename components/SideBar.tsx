"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { ChevronRight, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

const SideBar = () => {
  const pathname = usePathname();
  const params = useParams();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" className="p-2">
        <ChevronRight />
      </Button>
    );
  }

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
    <>
      <Sheet>
        <SheetTrigger className="p-2">
          <Button variant="ghost">
            <ChevronRight />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <Link
                href={`/${params.storeId}/products`}
                className={cn(
                  "text transition-colors hover:text-primary py-4 px-3 rounded-md font-bold",
                  pathname === `/${params.storeId}/products`
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
              >
                Products
              </Link>
            </SheetTitle>
          </SheetHeader>

          {routes.map((route) => (
            <div className="w-full py-4 mt-6 space-y-4">
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
            </div>
          ))}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SideBar;
