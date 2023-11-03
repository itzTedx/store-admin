"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpDown as CaretSortIcon, CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-hot-toast";

const accountFormSchema = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface CategoryFormProps {
  categories: {
    name: string;
    id: string;
    subcategory: {
      name: string;
      id: string;
    }[];
  }[];
}

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
};

export function AccountForm({ categories }: CategoryFormProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(data: AccountFormValues) {
    toast(JSON.stringify(data, null, 2));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
        <FormField
          control={form.control}
          name="categoryId"
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
                        ? categories.find(
                            (category) =>
                              category.subcategory.find((i) => i.id) ===
                              field.value
                          )?.id
                        : "Select Category"}
                      <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>Nothing found.</CommandEmpty>

                    {categories.map((category) => (
                      <CommandGroup heading={category.name} key={category.id}>
                        {category.subcategory.map((sub) => (
                          <CommandItem
                            key={sub.name}
                            value={sub.id}
                            onSelect={() => {
                              const conlog = form.setValue(
                                "subcategoryId",
                                sub.name
                              );
                              console.log(conlog);
                            }}
                          >
                            {sub.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
