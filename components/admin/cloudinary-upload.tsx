"use client"

import { useRef, useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadImageToCloudinary } from "@/lib/storage/cloudinary"

interface CloudinaryUploadProps {
  multiple?: boolean
  onUploaded: (urls: string[]) => void
  buttonText?: string
}

export function CloudinaryUpload({ multiple = false, onUploaded, buttonText = "Upload Image" }: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    try {
      setUploading(true)
      setError(null)
      const uploads = await Promise.all(Array.from(files).map((file) => uploadImageToCloudinary(file)))
      onUploaded(uploads.map((upload) => upload.url))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <Button type="button" variant="outline" className="gap-2" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {uploading ? "Uploading..." : buttonText}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
