import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import TreeActions from "./TreeActions";
import { TreeRefetchHook } from "./TreeRefetchHook";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
// import { ScrollArea } from "~/components/ui/scroll-area";

export default function Tree() {
  const { userAccess } = TreeRefetchHook();
  const pathname = usePathname()

  return (
    <div className="">
      {userAccess?.data?.map((access, index) => (
        <div key={access.id} className="flex flex-col items-center w-72">
          <div
            className={cn(
              "flex justify-between items-center rounded py-1 px-3 mr-2  w-full  hover:bg-accent hover:text-accent-foreground",
              pathname?.startsWith(`/tree/${access.tree.id}`)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Link
              href={`/tree/${access.tree.id}`}
              className="w-full truncate text-lg"
            >
              <p className="w-full truncate text-lg">{access.tree.name}</p>
              {access.tree.type === "PUBLIC" ?
                <p className="text-sm">Public</p> : <p className="text-sm">Privé</p>}
            </Link>
            <div className="cursor-pointer">
              <TreeActions
                treeInfo={{
                  treeId: access.tree.id,
                  treeName: access.tree.name,
                  treeType: access.tree.type,
                }}
              />
            </div>
          </div>
          {index !== userAccess.data?.length - 1 && <Separator />}
        </div>
      )) ?? <div>Chargement...</div>}
    </div>
  );
}
// <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
//   <div className="flex flex-col space-y-3">
//
//   </div>
//   <div className="flex flex-col space-y-2">
//
//   </div>
// </ScrollArea>
