import React from "react";
import { type AppType } from "next/app";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { api } from "../utils/api";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Sidebar from "../components/Sidebar";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
    <header className='bg-primary top-0 z-50 w-full justify-between text-white border-b border-gray-700 backdrop-blur'>
      <div className='container mx-auto flex gap-5 items-center p-4'>
        <button>
            <HiOutlineMenuAlt2 className='text-3xl' onClick={() => setIsOpen(!isOpen)} />
        </button>
        <h1 className='text-2xl font-bold '>CelloTree</h1>
      </div>
    </header>
    <Sidebar isOpen={isOpen} />
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
