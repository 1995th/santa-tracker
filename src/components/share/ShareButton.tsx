import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareButton({ location }: { location?: string }) {
  const handleShare = async () => {
    const shareText = location
      ? `🎅 Santa is currently in ${location}! Track Santa's journey live!`
      : "🎅 Track Santa's journey live!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Santa Tracker",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-20 right-16 bg-background/50 backdrop-blur-sm z-50"
      onClick={handleShare}
    >
      <Share2 className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Share location</span>
    </Button>
  );
}