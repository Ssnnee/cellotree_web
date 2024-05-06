import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import TreeActions from "./TreeActions";
import { TreeRefetchHook } from "./TreeRefetchHook";
import { useState, useEffect } from "react";

export default function Tree() {
  const { userAccess } = TreeRefetchHook();
  const [isClicked, setIsClicked] = useState<string | null>(null);

  const saveClickedId = (id: string | null) => {
    if (id) {
      localStorage.setItem('clickedDivId', id);
    } else {
      localStorage.removeItem('clickedDivId');
    }
  };

  const getClickedId = () => {
    const id = localStorage.getItem('clickedDivId');
    return id ? id : null;
  };

  useEffect(() => {
    const clickedId = getClickedId();
    setIsClicked(clickedId);
  }, []);

  return (
    <div className="">
      {userAccess.data?.map((access, index) => (
      <div key={access.id} className="flex flex-col">
        <div
          className={`flex justify-between items-center rounded py-2 px-4
          hover:bg-accent hover:text-accent-foreground
          ${isClicked === access.id && "bg-accent text-accent-foreground"}`}
          onClick={() => {
            const newIsClicked = isClicked === access.id ? null : access.id;
            setIsClicked(newIsClicked);
            saveClickedId(newIsClicked);
          }}
        >
          <Link href={`/tree/${access.tree.id}`} className="w-full ">
            <p className="w-full truncate text-lg">{access.tree.name}</p>
            {access.tree.type === "public" ?
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
