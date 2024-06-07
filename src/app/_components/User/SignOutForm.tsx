import { signOut } from "~/actions/auth.actions";
import { Button } from "~/components/ui/button";
// import { useRouter } from "next/navigation"
// import { validateRequest } from "~/lib/auth";


export default function SignOutForm() {
  // const user  = validateRequest();
  // const router = useRouter();
  // if (!user) {
  //   router.refresh();
  // }

  return (
    <form action={signOut}>
      <Button type="submit">Se déconnecter</Button>
    </form>
  );
}

