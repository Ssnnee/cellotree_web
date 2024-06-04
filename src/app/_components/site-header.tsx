"use client"
import Link from "next/link"
import { SideBar } from "./side-bar"
import { ModeToggle } from "./ModeToggle"
import { SignInDialog } from "./User/SignInDialog"
import { ProfileDialog } from "./User/profile-dialog"
import { getUser } from "~/actions/auth.actions"
import { useState } from "react"

export function SiteHeader() {
  const [username, setUsername] = useState<string | null>(null);
  const [ userId, setUserId ] = useState<string | null>(null);

  async function checkUser() {
    const user = await getUser();
    if (user) {
      setUsername(user.username);
      setUserId(user.id);
    } else {
      setUsername(null);
      setUserId(null);
    }
  }
  checkUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className='flex gap-5 items-center'>
        { userId && <SideBar userId={userId} /> }
          <Link href="/">
            <h1 className='hidden text-2xl font-bold md:block '>CelloTree</h1>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center">
            { !username
                ? <SignInDialog  />
                : <ProfileDialog username={username} />
            }
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
