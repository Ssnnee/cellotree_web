import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path =`./public/${file.name}`
  await writeFile(path, buffer)
  console.log(`open ${path} to see the uploaded file`)

  return NextResponse.json({ success: true })
}



// DELETE the file at the given path
export async function DELETE(request: NextRequest) {
  const data = await request.formData()
  const path = data.get('path') as string
  try {
    fs.unlinkSync(`./public${path}`)
  } catch (e) {
    console.error(e)
  }
  return NextResponse.json({ success: true })
}
  // const { searchParams } = new URL(request.url);
  // const filename = searchParams.get('filename') || '';
  //
  // if(filename && request.body) {
  //   // ⚠️ The below code is for App Router Route Handlers only
  //   const blob = await put(filename, request.body, {
  //     access: 'public',
  //   });
  //
  //   // Here's the code for Pages API Routes:
  //   // const blob = await put(filename, request, {
  //   //   access: 'public',
  //   // });
  //
  //   return NextResponse.json(blob);
  // } else {
  //   return NextResponse.json({ message: "No filename provided" });
  // }
  //
