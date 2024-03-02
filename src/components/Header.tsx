import React from 'react'
import Image from 'next/image'

export default function Header() {
  return (
    <header className='bg-primary top-0 z-50 w-full text-white border-b backdrop-blur'>
      <div className='container mx-auto flex gap-5 items-center p-4'>
        <button>
          <Image
            src='/assets/bar3_left.svg'
            alt='CelloTree'
            width={40}
            height={40}
          />
        </button>
        <h1 className='text-2xl font-bold '>CelloTree</h1>
      </div>
    </header>
  )
}
