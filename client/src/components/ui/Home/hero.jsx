import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <div className="w-full min-h-screen flex items-center justify-center py-45 lg:py-32 bg-cover bg-center">
    <div className="container mx-auto text-center px-4">
      {/* Text Section */}
      <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-4">
        This is the start of something!
      </h1>
      <p className="text-xl leading-relaxed tracking-tight text-muted-foreground mb-6">
        Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.
      </p>
      <Button size="lg" className="gap-4 mx-auto">
        Sign up here <MoveRight className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
