import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, message: "File not provided correctly"})
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const path =`./public/${file.name}`
  await writeFile(path, buffer)
  console.log(`open ${path} to see the uploaded file`)

  return NextResponse.json({ success: true, message: "File uploaded"})
}



export async function DELETE(request: NextRequest) {
  const data = await request.formData()
  const path = data.get('path') as string

  if (!path) {
    return NextResponse.json({ success: false, message: "File not deleted" })
  }
  if (path.length === 0) {
    return NextResponse.json({ success: false, message: "File not deleted"})
  }

  try {
    fs.unlinkSync(`./public${path}`)
  } catch (e) {
    console.error(e)
  }
  return NextResponse.json({ success: true, message: "File deleted"})
}
