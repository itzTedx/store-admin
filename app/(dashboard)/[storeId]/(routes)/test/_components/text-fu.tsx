import { formatSlug } from "@/lib/utils"

interface CategoryFormProps {
  string: string
}

const TestFn = ({ string }: CategoryFormProps) => {
  const test = formatSlug(string)
  return <div>{test}</div>
}

export default TestFn
