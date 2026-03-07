"use client";

import { X, Download, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useImageStore, type GeneratedImage } from "@/store/image-store";

export default function SceneGallery() {
  const { images, lightboxImage, setLightboxImage, removeImage } = useImageStore();

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Generated images will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="font-heading text-xl font-bold mb-4">Generated Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              onClick={() => img.status === "succeeded" && setLightboxImage(img)}
              onRemove={() => removeImage(img.id)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            {lightboxImage.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.prompt}
                className="w-full rounded-xl"
              />
            )}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-white text-sm truncate flex-1 mr-4">
                {lightboxImage.prompt}
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                  {lightboxImage.style}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                  {lightboxImage.aspectRatio}
                </span>
                {lightboxImage.imageUrl && (
                  <a
                    href={lightboxImage.imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ImageCard({
  image,
  onClick,
  onRemove,
}: {
  image: GeneratedImage;
  onClick: () => void;
  onRemove: () => void;
}) {
  const isPending = image.status === "starting" || image.status === "processing";
  const isFailed = image.status === "failed";

  return (
    <div className="relative group rounded-xl overflow-hidden border bg-gray-50 aspect-video">
      {image.status === "succeeded" && image.imageUrl ? (
        <button onClick={onClick} className="w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="w-full h-full object-cover"
          />
        </button>
      ) : isPending ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <p className="text-xs text-gray-400 capitalize">{image.status}...</p>
        </div>
      ) : isFailed ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <p className="text-xs text-red-400 text-center">{image.error ?? "Failed"}</p>
        </div>
      ) : null}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end opacity-0 group-hover:opacity-100">
        <div className="w-full p-2 flex justify-between items-center">
          <span className="text-white text-xs truncate flex-1">{image.prompt}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-2 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
