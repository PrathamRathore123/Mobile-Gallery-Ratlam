import { env } from "@/lib/constants/env"

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

export interface UploadedImage {
  url: string
  publicId: string
}

export async function uploadImageToCloudinary(file: File): Promise<UploadedImage> {
  if (!env.cloudinary.cloudName || !env.cloudinary.uploadPreset) {
    throw new Error("Cloudinary environment variables are missing")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", env.cloudinary.uploadPreset)
  formData.append("folder", env.cloudinary.folder)

  const endpoint = `https://api.cloudinary.com/v1_1/${env.cloudinary.cloudName}/image/upload`

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Image upload failed")
  }

  const payload = (await response.json()) as CloudinaryUploadResponse

  return {
    url: payload.secure_url,
    publicId: payload.public_id,
  }
}
