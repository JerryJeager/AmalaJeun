import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { Image, Loader2, Plus } from "lucide-react";
import { AmalaSpotNew } from "@/types/type";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { getCookie } from "@/actions/handleCookies";
import { BASE_URL } from "@/data/data";

interface ImagesDialogProps {
  open: boolean;
  spot: AmalaSpotNew;
  setIsAuthModalOpen: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ImagesDialog({
  open,
  spot,
  setIsAuthModalOpen,
  setOpen,
}: ImagesDialogProps) {
  const [images, setImages] = useState<string[]>(spot.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const token = await getCookie("amalajeun_token");
      if (!token?.value) {
        setOpen(false); 
        setTimeout(() => setIsAuthModalOpen(true), 300);
        return;
      }
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${BASE_URL()}/api/v1/spots/${spot.id}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      if (data.image_url) {
        setImages((prev) => [data.image_url, ...prev]);
      }
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const gridClass =
    "grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-[60vh] overflow-y-auto";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-primary border-2 border-primary bg-transparent"
        >
          <Image />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Amala Spot Images</DialogTitle>
        </DialogHeader>
        <div className="flex items-center mb-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="ml-2">Add Image</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
        </div>
        <div className={gridClass}>
          {images && images.length > 0 ? (
            images.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded overflow-hidden border bg-muted flex items-center justify-center"
              >
                <img
                  src={img}
                  alt={`Spot image ${idx + 1}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No images yet.
            </div>
          )}
        </div>
        {/* <DialogClose asChild>
          <Button variant="ghost" className="mt-4 w-full">
            Close
          </Button>
        </DialogClose> */}
      </DialogContent>
    </Dialog>
  );
}
