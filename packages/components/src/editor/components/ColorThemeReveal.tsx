import type { ThemeArray } from "@upstart.gg/sdk/shared/theme";
import { useEffect, useState, useRef } from "react";

const ColorThemeAnimation = ({ themes: defaultThemes }: { themes: ThemeArray }) => {
  const [themes, setThemes] = useState<ThemeArray>(defaultThemes);

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const blobsRef = useRef<Blob[]>([]);

  class Blob {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocity: { x: number; y: number };
    alpha: number;
    targetAlpha: number;

    constructor(x: number, y: number, radius: number, color: string) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      };
      this.alpha = 0.4;
      this.targetAlpha = 0.5 + Math.random() * 0.3;
    }

    update(ctx: CanvasRenderingContext2D, width: number, height: number) {
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      if (this.x < 0 || this.x > width) this.velocity.x *= -1;
      if (this.y < 0 || this.y > height) this.velocity.y *= -1;

      if (this.alpha < this.targetAlpha) this.alpha += 0.01;

      this.draw(ctx);
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace(")", `, ${this.alpha})`).replace("rgb", "rgba");
      ctx.fill();
      ctx.closePath();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create blobs with current theme colors
    const createBlobs = () => {
      blobsRef.current = [];
      const currentTheme = themes[currentThemeIndex];

      Object.entries(currentTheme.colors).forEach(([colorType, color]) => {
        // Create more blobs to cover the entire screen
        for (let i = 0; i < 8; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 120 + Math.random() * 120;
          blobsRef.current.push(new Blob(x, y, radius, color));
        }
      });
    };

    const animate = () => {
      if (!isAnimating) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw with blur effect for glow
      ctx.filter = "blur(60px)";
      blobsRef.current.forEach((blob) => blob.update(ctx, canvas.width, canvas.height));
      ctx.filter = "none";

      animationRef.current = requestAnimationFrame(animate);
    };

    createBlobs();
    animate();

    // Cycle through themes every 5 seconds
    const themeInterval = setInterval(() => {
      setCurrentThemeIndex((prev) => {
        if (prev + 1 >= themes.length) {
          return 0;
        }
        return prev + 1;
      });
      createBlobs();
    }, 5000);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      clearInterval(themeInterval);
    };
  }, [currentThemeIndex, themes, isAnimating]);

  return (
    <div className=" fixed inset-0 flex flex-col items-center justify-center bg-gray-200 overflow-hidden opacity-20">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
    </div>
  );
};

export default ColorThemeAnimation;
