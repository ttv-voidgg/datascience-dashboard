"use client"

import React from "react"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploaderProps {
    onFileUpload: (file: File) => void
    isLoading: boolean
}

export function FileUploader({ onFileUpload, isLoading }: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type === "application/json") {
                onFileUpload(file)
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0])
        }
    }

    return (
        <div
            className={`m-auto flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">Upload JSON File</h3>
            <p className="mb-4 text-sm text-muted-foreground">Drag and drop your file here or click to browse</p>
            <Label htmlFor="file-upload" className="w-full">
                <Input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleChange}
                    className="hidden"
                    disabled={isLoading}
                    ref={fileInputRef}
                />
                <Button className="w-full bg-black text-white" disabled={isLoading} onClick={() => fileInputRef.current?.click()} type="button">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Select File"
                    )}
                </Button>
            </Label>
        </div>
    )
}
