"use server"

import { writeFile } from 'fs/promises'
import fs from 'fs'

export async function uploadFile(data: FormData) {
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return { success: false, message: "File not provided correctly"}
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const path =`./public/${file.name}`
    await writeFile(path, buffer)
    return { success: true, message: `File uploaded. Open ${path} to see the uploaded file`}
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }

}

export async function deleteFile(data: FormData) {
  const path = data.get('path') as string

  if (!path) {
    return { success: false, message: "File not deleted" }
  }
  if (path.length === 0) {
    return { success: false, message: "Path is empty" }
  }

  try {
    fs.unlinkSync(`./public${path}`)
    return {
      success: true, message: "File deleted"
    }
  } catch (error: any) {
    return {
      error: error?.message
    }
  }
}
