import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function DataTableSkeleton() {
  return (
    <div className="container relative">
      <Card>
        <CardContent>
          <div className="pt-6">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-[150px] rounded" />
                <Skeleton className="hidden sm:flex h-8 w-[150px] rounded" />
              </div>
              <Skeleton className="h-8 w-[50px] rounded" />
            </div>
            <br />
            <div className="w-full">
              <Skeleton className="h-8 w-full rounded mb-2" />
              <Skeleton className="h-8 w-full rounded mb-2" />
              <Skeleton className="h-8 w-full rounded mb-2" />
              <Skeleton className="h-8 w-full rounded mb-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
