import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLogsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-16" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Logs Display Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs List Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Details Skeleton */}
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
