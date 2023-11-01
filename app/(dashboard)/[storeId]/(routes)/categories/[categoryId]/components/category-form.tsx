"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { useState } from "react"
import Image from "next/image"
import { Billboard, Category, Subcategory } from "@prisma/client"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { Minus, Plus, Trash, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),

  billboardId: z.string().min(1),
  subcategory: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .optional(),
})

type categoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}

export default function categoryForm({
  billboards,
  initialData,
}: CategoryFormProps) {
  const router = useRouter()
  const params = useParams()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // This can come from your database or API.
  const defaultValues: Partial<categoryFormValues> = {
    subcategory: [{ name: initialData?.name || "" }],
  }

  const title = initialData ? "Edit category" : "Create category"
  const description = initialData ? "Edit a category." : "Add a new category"
  const toastMessage = initialData ? "Category updated." : "Category created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<categoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || defaultValues,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    name: "subcategory",
    control: form.control,
  })

  async function onSubmit(data: categoryFormValues) {
    console.log(data)

    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        )
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      )
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success("Category deleted.")
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this category first."
      )
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

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
      <div className="max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-5 space-y-8"
          >
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

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
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
                            placeholder="Select a Billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="">
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            <div className="flex items-center gap-3">
                              <div className="relative w-8 h-6 ">
                                <Image
                                  src={billboard.imageUrl}
                                  fill
                                  className="object-cover rounded"
                                  alt="Billboards"
                                />
                              </div>
                              <p>{billboard.label}</p>
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
                            onClick={() => remove(index)}
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
      </div>
    </>
  )
}
