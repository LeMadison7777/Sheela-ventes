"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";

interface UploadButtonProps {
  onUploadSuccess: (url: string, type: "IMAGE" | "VIDEO") => void;
  label?: string;
}

export default function UploadButton({
  onUploadSuccess,
  label = "Choisir une photo ou vidéo depuis le téléphone",
}: UploadButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result: any) => {
        const url = result.info.secure_url;
        const resourceType = result.info.resource_type;
        const type = resourceType === "video" ? "VIDEO" : "IMAGE";
        onUploadSuccess(url, type);
        setLoading(false);
        // Force la réactivation du défilemnet de la page
        document.body.style.overflow = "auto";
      }}
      onOpen={() => setLoading(true)}
      onClose={() => {
        setLoading(false);
        // Force la réactivation du défilemnet de la page
        document.body.style.overflow = "auto";
      }}
      options={{
        sources: ["local", "camera", "url"],
        clientAllowedFormats: ["image", "video"],
        maxFileSize: 50000000,
      }}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            onClick={() => open()}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-4 text-sm font-medium text-white transition-all cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-pink-400" />
            ) : (
              <ImagePlus className="h-5 w-5 text-pink-400" />
            )}
            <span>{label}</span>
          </button>
        );
      }}
    </CldUploadWidget>
  );
}