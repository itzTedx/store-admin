import { formatSlug } from "@/lib/utils";
import { Billboard } from "@prisma/client";
import React from "react";

interface CategoryFormProps {
  billboards: Billboard[];
}

const TestFn = ({ billboards }: CategoryFormProps) => {
  const formated = billboards.map((item) => item.label);

  const test = formatSlug(`Hello I'm Melwin! - And {im a graphic design 12}`);
  return <div>{test}</div>;
};

export default TestFn;
