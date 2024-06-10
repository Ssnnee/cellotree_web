"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-alert-dialog"
import {
  AccessibilityIcon,
  LaptopIcon,
  MoonIcon,
  PersonIcon,
  SunIcon,
} from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { cn } from "../../lib/utils"
import { Button } from "~/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command"
import { api } from "~/trpc/react"

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()
  const { data: trees } = api.tree.getAll.useQuery()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-72"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">
          Rechercher un parent ou une famille...
        </span>
        <span className="inline-flex lg:hidden">Recherche...</span>
        <kbd
          className="pointer-events-none absolute right-[0.3rem]
          top-[0.3rem] hidden h-5 select-none items-center gap-1
          rounded border bg-muted px-1.5 font-mono text-[10px] font-medium
          opacity-100 sm:flex"
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Taper un nom de famille ou d&apos;un parent" />
        <CommandList>
          <CommandEmpty>
            Pas de résultats trouvé. Pensez à créer votre
            famille s&apos;il elle n&apos;est déjà présente
          </CommandEmpty>
          <CommandGroup heading="Familles">
            {trees?.map((tree) => (
              <CommandItem
                key={tree.id}
                value={tree.name}
                onSelect={() => {
                  runCommand(() => router.push(`/member/${tree.id}`))
                }}
              >
                <AccessibilityIcon className="mr-2 h-4 w-4" />
                {tree.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Membres">
            {trees?.flatMap(tree => tree.member).map((member) => (
              <CommandItem
                key={member.id}
                value={`${member.firstname} ${member.lastname}`}
                onSelect={() => {
                  runCommand(() => router.push(`/member/${member.treeId}`))
                }}
              >
                <PersonIcon className="mr-2 h-4 w-4" />
                {member.firstname} {member.lastname}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Clair
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Sombre
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              Système
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
