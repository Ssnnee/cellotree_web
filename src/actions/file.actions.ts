"use server"

import { writeFile, unlink } from 'fs/promises'

export async function uploadFile(data: FormData) {
  const file: File | null = data.get('file') as File | null;

  if (!file) {
    return { success: false, message: "File not provided correctly" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `./public/${file.name}`;
    await writeFile(path, buffer);
    return { success: true, message: `File uploaded. Open ${path} to see the uploaded file` };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
}

export async function deleteFile(data: FormData) {
  const path = data.get('path') as string | null;

  if (!path) {
    return { success: false, message: "File not deleted" };
  }
  if (path.length === 0) {
    return { success: false, message: "Path is empty" };
  }

  try {
    await unlink(`./public${path}`);
    return {
      success: true, message: "File deleted"
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Unknown error occurred",
    };
  }
}

