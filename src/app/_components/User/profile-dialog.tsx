import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { signOut } from "~/actions/auth.actions";
import { useRouter } from "next/navigation"

interface ProfileDialogProps {
  username: string | null;
}

export function ProfileDialog({username}: ProfileDialogProps) {
  const router = useRouter();

  async function userSignedOut() {
    signOut()
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage sizes="icon" src="" alt={username ? username: "avatar"} />
          <AvatarFallback>
            {username && <span>{username.substring(0,2)}</span>}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={userSignedOut}>
          Se deconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
