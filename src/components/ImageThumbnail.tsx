"use client";
import { useEffect, useState } from "react";

interface ImageThumbnailProps {
  steamAppId?: string;
  originalUrl: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const STEAM_IMAGE_SIZES = [
  "header", // 920 x 430
  "capsule_616x353", // 616 x 353
  "capsule_467x181", // 467 x 181
  "capsule_231x87", // 231 x 87
  "capsule_184x69", // 184 x 69
  "capsule_sm_120" // 120 x 45
];

export default function ImageThumbnail({
  steamAppId,
  originalUrl,
  alt,
  width,
  height,
  className
}: ImageThumbnailProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [currentSizeIndex, setCurrentSizeIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Extract Steam app ID from URL if not provided
  const getSteamAppId = (url: string): string | null => {
    const match = url.match(/apps\/(\d+)/);
    return match ? match[1] : null;
  };

  // Generate Steam image URL for a specific size
  const getSteamImageUrl = (appId: string, size: string): string => {
    return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/${size}.jpg`;
  };

  // Check if URL is a Steam image
  const isSteamImage = (url: string): boolean => {
    return url.includes("steamstatic.com") && url.includes("apps/");
  };

  // Initialize with largest Steam size or original URL
  const initialiseImageUrl = () => {
    const appId = steamAppId || getSteamAppId(originalUrl);

    if (appId && isSteamImage(originalUrl)) {
      // Start with the largest Steam size
      const largestSize = STEAM_IMAGE_SIZES[0];
      const largestUrl = getSteamImageUrl(appId, largestSize);
      setCurrentImageUrl(largestUrl);
      setCurrentSizeIndex(0);
    } else {
      // Not a Steam image, use original URL
      setCurrentImageUrl(originalUrl);
      setCurrentSizeIndex(-1); // -1 indicates we're using original URL
    }
  };

  // Try next image size
  const tryNextSize = () => {
    const appId = steamAppId || getSteamAppId(originalUrl);

    if (!appId || !isSteamImage(originalUrl)) {
      // Not a Steam image, use original URL
      setCurrentImageUrl(originalUrl);
      setHasError(true);
      return;
    }

    const nextIndex = currentSizeIndex + 1;

    if (nextIndex < STEAM_IMAGE_SIZES.length) {
      const nextSize = STEAM_IMAGE_SIZES[nextIndex];
      const nextUrl = getSteamImageUrl(appId, nextSize);
      setCurrentImageUrl(nextUrl);
      setCurrentSizeIndex(nextIndex);
      setIsLoading(true);
      setHasError(false);
    } else {
      // All Steam sizes failed, use original URL
      setCurrentImageUrl(originalUrl);
      setHasError(true);
    }
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Handle image load error
  const handleError = () => {
    setIsLoading(false);
    if (isSteamImage(originalUrl)) {
      // Try next Steam size
      tryNextSize();
    } else {
      // Use original URL for non-Steam images
      setCurrentImageUrl(originalUrl);
      setHasError(true);
    }
  };

  // Reset when originalUrl changes
  useEffect(() => {
    initialiseImageUrl();
    setIsLoading(true);
    setHasError(false);
  }, [originalUrl]);

  return (
    <div className={`relative ${className || ""}`}>
      <img
        src={currentImageUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoading ? 0.5 : 1,
          transition: "opacity 0.3s ease"
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {hasError && currentImageUrl === originalUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="text-white text-xs text-center">Image unavailable</div>
        </div>
      )}
    </div>
  );
}
