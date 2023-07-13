import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@ui/buttons'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@ui/form'
import { toast } from '@ui/toast'

import { TextLead } from '@ui/typography'

const FormSchema = z.object({
  search: z
    .string({
      required_error: 'Please add a valid search term',
    })
    .min(2, {
      message: 'Search Term be at least 2 characters.',
    }),
})

export function SearchForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /* @TODO: Implement Search Form - remove this section */
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-4 sm:px-0 py-8 sm:py-0 ml-auto flex gap-x-4 w-full"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full sm:pl-4 sm:py-8">
              <FormLabel hidden aria-hidden>
                Search
              </FormLabel>
              <FormControl>
                <Input
                  className="text-secondary-sky-11"
                  placeholder="Search A Tour..."
                  {...field}
                />
              </FormControl>
              <FormDescription hidden aria-hidden>
                Enter Your Search.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="secondary"
          type="submit"
          className="py-2 sm:py-4 px-4 rounded-sm sm:rounded-none self-start sm:self-stretch sm:h-full uppercase tracking-wider"
        >
          Search
        </Button>
      </form>
    </Form>
  )
}

export default function HeroSearch({ className }: { className?: string }) {
  return (
    <section
      className={`col-start-2 col-span-12 md:col-start-3 md:col-span-10 row-start-2 row-span-3 z-[4] flex flex-col items-center  ${className}`}
    >
      <TextLead className="bg-primary md:2xl  px-8 py-2 rounded-full translate-y-5 inline-block uppercase lending-wider">
        Find Your Tour
      </TextLead>
      <div className="bg-primary text-primary-foreground flex flex-col sm:flex-row gap-5 sm:justify-between w-full h-full rounded-md shadow-lg">
        {/* @TODO: Add advanced search form */}
        <SearchForm />
      </div>
    </section>
  )
}
