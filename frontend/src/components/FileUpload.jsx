import React from "react";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export default function FileUpload({ name = "file", onFile }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    onFile?.(file);
  }

  function syncDroppedFile(file) {
    if (!file || !inputRef.current) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    handleFile(file);
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        syncDroppedFile(event.dataTransfer.files[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer rounded-3xl border-2 border-dashed border-cyan-200 bg-cyan-50/70 p-8 text-center transition hover:border-cyan-400 hover:bg-cyan-100/70 dark:border-cyan-900 dark:bg-slate-900"
    >
      <input ref={inputRef} name={name} type="file" accept="image/*,.dcm" required className="hidden" onChange={(event) => handleFile(event.target.files[0])} />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-lg">
        <UploadCloud size={26} />
      </div>
      <p className="mt-4 font-black text-slate-950 dark:text-white">Drag and drop scan image</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{fileName || "PNG, JPG, WEBP, BMP, or DICOM"}</p>
    </div>
  );
}
