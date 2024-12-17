import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareButton({ location }: { location?: string }) {
  const handleShare = async () => {
    const shareText = location
      ? `🎅 Santa is currently in ${location}! Track Santa's journey live!`
      : "🎅 Track Santa's journey live!";
    const shareUrl = window.location.href;

    try {
      // Check if the Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: "Santa Tracker",
          text: shareText,
          url: shareUrl,
        });
        toast.success("Thanks for sharing!");
      } else {
        // Fallback to clipboard copy for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Link copied to clipboard! Share it with your friends!");
      }
    } catch (err) {
      // Handle user cancellation or other errors gracefully
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled the share operation
        return;
      }
      console.error("Error sharing:", err);
      toast.error("Oops! Something went wrong while sharing.");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-16 left-4 bg-background/50 backdrop-blur-sm z-50"
      onClick={handleShare}
    >
      <Share2 className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Share location</span>
    </Button>
  );
}