import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from "~/app/_components/page-header";
import { Skeleton } from "~/components/ui/skeleton";

export default function ViewPageSkeleton() {
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          <Skeleton className="h-20 md:w-[800px] sm:w-44 rounded" />
        </PageHeaderHeading>
        <PageHeaderDescription>
          <Skeleton className="h-4 w-full max-w-[700px] rounded" />
          <Skeleton className="h-4 w-full max-w-[700px] rounded mt-2" />
          <Skeleton className="h-4 w-full max-w-[700px] rounded mt-2" />
        </PageHeaderDescription>
        <PageActions>
          <Skeleton className="h-10 w-[200px] rounded" />
        </PageActions>
      </PageHeader>
    </div>
  );
}

