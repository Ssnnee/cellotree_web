// import dynamic from "next/dynamic"
import { SiteHeader } from "../_components/site-header"

interface AppLayoutProps {
  children: React.ReactNode
}

// const DynamicHeader = dynamic(() => import("../_components/site-header"), {
//    ssr: false,
// });

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <main className="flex-1">
        <SiteHeader />
        {children}
      </main>
    </>
  )
}

