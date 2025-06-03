import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <Skeleton className="h-10 w-[250px] mb-6" />
      <Skeleton className="h-5 w-full max-w-2xl mb-6" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>

      <Skeleton className="h-[400px] w-full mb-6" />
    </div>
  )
}
