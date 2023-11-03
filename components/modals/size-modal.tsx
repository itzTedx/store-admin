"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, Trash, X } from "lucide-react";
import * as z from "zod";
import { Size } from "@prisma/client";
import { Modal } from "../ui/modal";

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  initialData: Size;
}

const sizeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),

  value: z.string(),
});
type sizeFormValues = z.infer<typeof sizeFormSchema>;

export const SizeModal: React.FC<SizeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,

  initialData,
}) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // This can come from your database or API.
  const defaultValues: Partial<sizeFormValues> = {
    name: [{ name: initialData?.name || "" }],
  };

  const form = useForm<sizeFormValues>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: initialData || defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "sizeId",
    control: form.control,
  });

  async function onSubmit(data: sizeFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Size Added Successfully");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this category first."
      );
    } finally {
      loading;
      onClose;
    }
  };

  return (
    <Modal
      title="Add new size"
      description="This action cannot be undone. Be Sure"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                {/* <FormDescription>
                    {initialData
                      ? "Update Existing Category Name"
                      : "Create New Category Name"}
                  </FormDescription> */}
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Category name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`subcategory.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Subcategories
                    </FormLabel>

                    <FormControl>
                      <div className="flex">
                        <Input
                          {...field}
                          disabled={loading}
                          placeholder="New Subcategory"
                          className={cn("rounded-s-md rounded-e-none")}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={cn("rounded-s-none rounded-e-md h-auto")}
                          onClick={() => {}}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ name: "" })}
            >
              <Plus size={16} className="mr-2" /> Add
            </Button>
          </div>
          <Button type="submit">{action}</Button>
        </form>
      </Form>
      <div className="flex items-center justify-end w-full pt-6 space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Add
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
