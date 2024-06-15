import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import TreeActions from "./TreeActions";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";

interface TreeProps {
    userId: string;
}

export default function Tree({ userId }: TreeProps) {
  const userAccess = api.access.getByUserId.useQuery({ id: userId });
  const pathname = usePathname()
  const treeIdFromCookie = getCookie('isEnableToSee')

  function setAccessCookie(treeId: string) {
    if (treeId !== treeIdFromCookie) {
      removeCookie('isEnableToSee')
      setCookie('isEnableToSee', `${treeId}`, { expires: 1 })
    }
    setCookie('isEnableToSee', `${treeId}`, { expires: 1 })
  }

  return (
    <div className="">
      {userAccess?.data?.map((access, index) => (
        <div key={access.id} className="flex flex-col items-center w-72">
          <div
            className={cn(
              "flex justify-between items-center rounded py-1 px-3 mr-2 w-full  hover:bg-accent hover:text-accent-foreground",
              pathname?.startsWith(`/tree/${access.tree.id}`) ||
              pathname?.startsWith(`/view/${access.tree.id}`) ||
              pathname?.startsWith(`/member/${access.tree.id}`) ||
              pathname?.startsWith(`/access/${access.tree.id}`)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Link
              href={`/member/${access.tree.id}`}
              className="w-full truncate text-lg"
              onClick={() => setAccessCookie(access.tree.id)}
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
                refetch={() => userAccess.refetch()}
                accessLevel={access.level}
              />
            </div>
          </div>
          {index !== userAccess.data?.length - 1 && <Separator />}
        </div>
      )) ?? <div>Chargement...</div>}
    </div>
  );
}
