import { signOut } from "~/actions/auth.actions";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation"
import { validateRequest } from "~/lib/auth";


export default function SignOutForm() {
  const user  = validateRequest();
  const router = useRouter();
  if (!user) {
    router.refresh();
  }
  console.log("User from Signout : ", user);

  return (
    <form action={signOut}>
      <Button type="submit">Se déconnecter</Button>
    </form>
  );
}

