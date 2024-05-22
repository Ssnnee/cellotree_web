import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { Separator } from "~/components/ui/separator";


export function SignInDialog() {
  const [showRegisterFormInputs, setShowRegisterFormInputs] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild >
        <Button variant="default"> Se connecter </Button>
      </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-4">Vous n&apos;êtes pas connecter </DialogTitle>
            <Separator />
            <DialogDescription className="">
              {
                !showRegisterFormInputs
                ? "Remplissez les champ ci-dessous pour vous connecter à votre compte"
                : "Remplissez les champ ci-dessous pour vous creer votre compte"
              }
            </DialogDescription>
          </DialogHeader>
            {!showRegisterFormInputs
              ?
                <div className="flex flex-col gap-4">
                  <SignInForm />
                  <Button
                    variant={"outline"}
                    className="w-full"
                    onClick={() => setShowRegisterFormInputs(true)}
                  >
                    Je n&apos;ai pas de compte compte
                  </Button>
                </div>
              : <div className="flex flex-col gap-4">
                  <SignUpForm />
                  <Button
                    variant={"outline"}
                    className="w-full"
                    onClick={() => setShowRegisterFormInputs(false)}
                  >
                    J&apos;ai déjà un compte
                  </Button>
                </div>
            }
        </DialogContent>
    </Dialog>
  );
}
