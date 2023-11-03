"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpDown as CaretSortIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "react-hot-toast"

const accountFormSchema = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface CategoryFormProps {
  categories: {
    name: string
    id: string
    subcategory: {
      name: string
      id: string
    }[]
  }[]
}

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function AccountForm({ categories }: CategoryFormProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    toast(JSON.stringify(data, null, 2))
  }

  const subCat = categories.find((c) => c.subcategory)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
        <FormField
          control={form.control}
          name="subcategoryId"
          render={({ field }) => (
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
                        ? subCat?.subcategory.find((s) => s.id === field.value)
                            ?.name
                        : "Select category"}
                      {/* {field.value
                        ? categories.find(
                            (category) =>
                              category.subcategory.find((i) => i.id) ===
                              field.value
                          )?.id
                        : "Select Category"} */}
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
                            {category.subcategory &&
                              category.subcategory.map((sub) => (
                                <CommandItem
                                  key={sub.id}
                                  value={sub.name}
                                  onSelect={() => {
                                    form.setValue("subcategoryId", sub.id)
                                  }}
                                >
                                  {sub.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                          {/* {category.subcategory &&
                          category.subcategory.length > 0 ? (
                            <CommandGroup heading={category.name}>
                              <CommandItem
                                value={category.name}
                                onSelect={() => {
                                  form.setValue("subcategoryId", category.id)
                                }}
                              >
                                {category.name}
                              </CommandItem>
                            </CommandGroup>
                          ) : null} */}
                        </div>
                      ))}
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  )
}
