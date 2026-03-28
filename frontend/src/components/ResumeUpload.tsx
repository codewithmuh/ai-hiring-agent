"use client";

import { useState, useRef, type FormEvent } from "react";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { uploadResume, type Candidate } from "@/lib/api";

interface ResumeUploadProps {
  onUploadComplete?: (candidate: Candidate) => void;
}

export default function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const candidate = await uploadResume(file, jobDescription);
      setFile(null);
      setJobDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onUploadComplete?.(candidate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  }

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-white to-violet-50/30 p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold">Upload Resume</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Screen candidates with AI</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
            dragOver
              ? "border-violet-400 bg-violet-50/50 scale-[1.01]"
              : file
              ? "border-emerald-300 bg-emerald-50/50"
              : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) { setFile(selected); setError(null); }
            }}
          />
          {file ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 mb-3">
                <FileCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Click or drag to replace</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 mb-3 transition-colors group-hover:bg-violet-100">
                <Upload className="h-6 w-6 text-violet-500" />
              </div>
              <p className="text-sm font-medium text-foreground">Drop PDF here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">PDF files only, max 10MB</p>
            </>
          )}
        </div>

        <div>
          <label htmlFor="job-description" className="block text-sm font-medium mb-1.5">
            Job Description
          </label>
          <textarea
            id="job-description"
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description to match against..."
            className="w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all resize-none"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing Resume...
            </span>
          ) : (
            "Upload & Screen"
          )}
        </button>
      </form>
    </div>
  );
}
