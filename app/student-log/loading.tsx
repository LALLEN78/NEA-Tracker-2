import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <Skeleton className="h-10 w-[250px] mb-6" />
      <Skeleton className="h-4 w-full max-w-[500px] mb-6" />

      <div className="grid w-full grid-cols-2 mb-6">
        <Skeleton className="h-10 rounded-l-md" />
        <Skeleton className="h-10 rounded-r-md" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-full max-w-[350px]" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>

          <div className="border rounded-md">
            <div className="h-10 border-b px-4 flex items-center">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px] ml-auto" />
              <Skeleton className="h-4 w-[150px] ml-4" />
              <Skeleton className="h-4 w-[100px] ml-4" />
              <Skeleton className="h-4 w-[80px] ml-4" />
            </div>

            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 border-b px-4 flex items-center">
                <Skeleton className="h-4 w-[80px]" />
                <div className="ml-4">
                  <Skeleton className="h-4 w-[120px] mb-2" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
                <Skeleton className="h-4 w-[150px] ml-auto" />
                <Skeleton className="h-6 w-[80px] ml-4" />
                <Skeleton className="h-8 w-[80px] ml-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
