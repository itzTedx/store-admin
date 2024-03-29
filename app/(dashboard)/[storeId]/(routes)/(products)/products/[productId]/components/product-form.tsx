"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Product, Quantity, Size } from "@prisma/client";
import axios from "axios";
import { Info, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpDown as CaretSortIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  images: z.object({ url: z.string() }).array(),

  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),

  actualPrice: z.coerce.number().min(1),
  discountPrice: z.coerce.number().optional(),

  // categoryId: z.string().optional(),
  subcategoryId: z.string(),
  quantityId: z.string().min(1),
  sizeId: z.string().min(1),
  timeFrame: z.coerce.number().min(1),

  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null;
  categories: {
    name: string;
    id: string;
    subcategory: {
      name: string;
      id: string;
    }[];
  }[];

  sizes: Size[];
  quantity: Quantity[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  quantity,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const buttonText = initialData ? "Update Image" : "Upload an Image";

  const defaultValues = initialData
    ? {
        ...initialData,
        actualPrice: parseFloat(String(initialData?.actualPrice)),
        // discountPrice: parseFloat(String(initialData?.discountPrice)),
        timeFrame: parseFloat(String(initialData?.timeFrame)),
      }
    : {
        name: "",
        images: [],
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        actualPrice: 0,
        discountPrice: "",
        subcategoryId: "",
        description: "",
        sizeId: "",
        timeFrame: 1,
        quantityId: "",
        isFeatured: false,
        isArchived: false,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    //@ts-ignore
    defaultValues,
  });

  //  initialData
  //     ? {
  //         ...initialData,
  //         actualPrice: parseFloat(String(initialData?.actualPrice)),
  //         discountPrice: parseFloat(String(initialData?.actualPrice)),
  //         timeFrame: parseFloat(String(initialData?.timeFrame)),
  //       }
  //     : {
  //         name: "",
  //         images: [],
  //         actualPrice: 0,
  //         discountPrice: 0,
  //         subcategoryId: "",
  //         description: "",
  //         sizeId: "",
  //         timeFrame: 1,
  //         quantityId: "",
  //         isFeatured: false,
  //         isArchived: false,
  //       },

  const subCat = categories.flatMap((c) => c.subcategory);

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Products deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="container w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                    buttonText={buttonText}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:gap-8 md:grid-cols-3">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Product name"
                        className="max-w-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid col-span-3 gap-6 md:grid-cols-3 ">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Type your message here."
                          id="description"
                          {...field}
                          rows={13}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="actualPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Price</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="9.99AED"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex gap-x-2">
                        Discounted Price
                        <HoverCard openDelay={100}>
                          <HoverCardTrigger>
                            <Info size={16} className="opacity-30" />
                          </HoverCardTrigger>
                          <HoverCardContent side="top" className="w-fit">
                            Optional
                          </HoverCardContent>
                        </HoverCard>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="9.99AED"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => {
                    console.log(field);
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Category</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? subCat?.find((s) => s.id === field.value)
                                      ?.name
                                  : "Select category"}

                                <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandEmpty>Nothing found.</CommandEmpty>
                              <div className="overflow-y-scroll max-h-52">
                                {categories.map((category) => (
                                  <div key={category.id}>
                                    <CommandGroup heading={category.name}>
                                      {category.subcategory.map((sub) => (
                                        <CommandItem
                                          key={sub.id}
                                          value={sub.name}
                                          onSelect={() => {
                                            form.setValue(
                                              "subcategoryId",
                                              sub.id
                                            );
                                          }}
                                        >
                                          {sub.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </div>
                                ))}
                              </div>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {/* <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select category"
                              />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="">
                            {categories.map((category) => (
                              <Fragment key={category.id}>
                                {category.subcategory.map((sub) => (
                                  <SelectItem value={sub.id}>
                                    <div className="flex items-center gap-3">
                                      <p>{sub.name}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="sizeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select size"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="">
                              {sizes.map((size) => (
                                <SelectItem key={size.id} value={size.id}>
                                  <div className="flex items-center gap-3">
                                    <p>
                                      {size.name} {`(`}
                                      {size.value}
                                      {`)`}
                                    </p>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div
                            className="flex items-center justify-center w-12 h-auto ml-1 border rounded cursor-pointer hover:bg-white/5"
                            onClick={() => {
                              router.push(`/${params.storeId}/sizes/new`);
                            }}
                          >
                            +
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeFrame"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Frame</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="2 working days"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantities</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select color"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="">
                            {quantity.map((qty) => (
                              <SelectItem key={qty.id} value={qty.id}>
                                <div className="flex items-center gap-3">
                                  <p>{qty.name}</p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    {/* <FormDescription>
                      This product will appear on the home page
                    </FormDescription> */}
                  </div>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear on the store anywhere
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> */}
          </div>
          <Heading title="SEO" description="Coming Soon" />
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Product name"
                    className="max-w-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Description</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Product name"
                    className="max-w-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Separate with the comma"
                    className="max-w-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Heading title="Product Overview" description="Coming Soon" />
          <Textarea
            rows={15}
            disabled={loading}
            placeholder="Separate with the comma"
            className="max-w-sm"
          />
          {/* <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Overview Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={15}
                    disabled={loading}
                    placeholder="Separate with the comma"
                    className="max-w-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Heading title="Templates" description="Coming Soon" />
          <Input type="file" />
          <Heading title="FAQs" description="Coming Soon" />
          <div className="space-y-3">
            <Input placeholder="Question" />
            <Input placeholder="Answer" />
            <Button variant="outline">Add FAQ</Button>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
