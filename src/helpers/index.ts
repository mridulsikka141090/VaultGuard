import { videoExtensions } from "@/constants";

export function isVideoFile(fileName: string): boolean {
  return videoExtensions.some(ext =>
    fileName.toLowerCase().endsWith(ext)
  );
}