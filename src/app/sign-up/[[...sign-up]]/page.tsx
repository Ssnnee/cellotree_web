import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-screen justify-center items-center align-middle">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
