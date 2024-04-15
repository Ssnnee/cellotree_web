import { SignIn, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { dark } from "@clerk/themes";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import Tree from "./_components/Tree";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">

    </main>
  );
}

async function CrudShowcase() {
  // const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
    </div>
  );
}
