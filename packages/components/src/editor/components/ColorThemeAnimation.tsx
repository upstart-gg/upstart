import { useEffect, useState, useRef, useCallback, type FC } from "react";

interface ColorTheme {
  id: string;
  name: string;
  colors: string[];
}

interface ColorParticlesAnimationProps {
  colors: string[];
  particleCount?: number;
  theme?: ColorTheme;
  pattern?: "circle" | "rectangle" | "spiral" | "random";
  onAnimationComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  themeColor: string;
  targetColor: string;
  speed: number;
  opacity: number;
}

const ColorParticlesAnimation: FC<ColorParticlesAnimationProps> = ({
  colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#1a535c", "#f7fff7"],
  particleCount = 2000,
  theme = {
    id: "1",
    name: "Ocean",
    colors: ["#1a535c", "#4ecdc4", "#f7fff7", "#ff6b6b", "#ffe66d"],
  },
  pattern = "circle",
  onAnimationComplete,
}) => {
  const [animationPhase, setAnimationPhase] = useState<"assembling" | "complete">("assembling");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  // Calculate target positions based on the selected pattern
  const calculateTargetPositions = useCallback(
    (canvas: HTMLCanvasElement, count: number): { x: number; y: number }[] => {
      const positions: { x: number; y: number }[] = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;

      switch (pattern) {
        case "circle":
          // Arrange particles in a circle
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = maxRadius * (0.8 + Math.random() * 0.2);
            positions.push({
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * radius,
            });
          }
          break;

        case "rectangle":
          {
            // Arrange particles in a rectangle
            const rectWidth = canvas.width * 0.7;
            const rectHeight = canvas.height * 0.7;
            const startX = centerX - rectWidth / 2;
            const startY = centerY - rectHeight / 2;

            const rows = Math.sqrt(count * (rectHeight / rectWidth));
            const cols = count / rows;

            for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                positions.push({
                  x: startX + (j / cols) * rectWidth,
                  y: startY + (i / rows) * rectHeight,
                });
              }
            }
          }
          break;

        case "spiral":
          {
            // Arrange particles in a spiral
            const totalTurns = 5;
            const b = totalTurns / count;

            for (let i = 0; i < count; i++) {
              const angle = b * i;
              const radius = (i / count) * maxRadius;
              positions.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
              });
            }
          }
          break;

        default:
          // Arrange particles randomly within a circle
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * maxRadius;
            positions.push({
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * radius,
            });
          }
          break;
      }

      return positions;
    },
    [pattern],
  );

  // Create particles for assembly phase
  const createAssemblyParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!canvas) return;

      const particles: Particle[] = [];
      const targetPositions = calculateTargetPositions(canvas, particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Random starting position (from outside the visible area)
        let startPosX: number, startPosY: number;

        // Determine which edge to start from
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) {
          // top
          startPosX = Math.random() * canvas.width;
          startPosY = -30;
        } else if (edge === 1) {
          // right
          startPosX = canvas.width + 30;
          startPosY = Math.random() * canvas.height;
        } else if (edge === 2) {
          // bottom
          startPosX = Math.random() * canvas.width;
          startPosY = canvas.height + 30;
        } else {
          // left
          startPosX = -30;
          startPosY = Math.random() * canvas.height;
        }

        // Create particle with theme color initially
        const themeColor = theme.colors[Math.floor(Math.random() * theme.colors.length)];
        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        const targetPosition = targetPositions[i % targetPositions.length];

        particles.push({
          x: startPosX,
          y: startPosY,
          targetX: targetPosition.x,
          targetY: targetPosition.y,
          size: 1.5 + Math.random() * 2.5,
          themeColor,
          targetColor,
          color: themeColor, // Start with theme color
          speed: 0.01 + Math.random() * 0.03,
          opacity: 0,
        });
      }

      particlesRef.current = particles;
    },
    [theme, colors, calculateTargetPositions, particleCount],
  );

  // Animation loop
  const startAnimation = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const animationStartTime = Date.now();
    let done = false;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      if (animationPhase === "complete") {
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle different animation phases
      if (animationPhase === "assembling") {
        let allAssembled = true;

        // Draw and update particles
        particlesRef.current.forEach((p) => {
          // Move toward target position
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared > 4) {
            // Not yet at target
            allAssembled = false;
            p.x += dx * p.speed;
            p.y += dy * p.speed;

            // Fade in
            if (p.opacity < 1) {
              p.opacity += 0.02;
            }

            // Gradually change from theme color to target color
            const progress = Math.max(0, 1 - Math.sqrt(distanceSquared) / 100);
            if (progress > 0.5 && p.color !== p.targetColor) {
              p.color = p.targetColor;
            }
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

          // Apply opacity to color
          if (p.color.startsWith("rgba")) {
            ctx.fillStyle = p.color.replace("1)", `${p.opacity})`);
          } else if (p.color.startsWith("#")) {
            const r = parseInt(p.color.slice(1, 3), 16);
            const g = parseInt(p.color.slice(3, 5), 16);
            const b = parseInt(p.color.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
          }

          ctx.fill();
        });

        // Check if assembly is complete or if we've spent too long (5 seconds max)
        const timeElapsed = Date.now() - animationStartTime;
        if (allAssembled || timeElapsed > 12000) {
          done = true;
          setAnimationPhase("complete");
          return;
        }
      }
      // Continue animation unless we're in the complete phase
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (!done) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [animationPhase]);

  // Initialize canvas and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Handle phase transitions
  useEffect(() => {
    if (animationPhase === "complete") {
      // Notify that animation is complete
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  }, [animationPhase, onAnimationComplete]);

  // Initialize animation when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      createAssemblyParticles(canvas);
      startAnimation();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [createAssemblyParticles, startAnimation]);

  return (
    <div className="fixed z-50 inset-0 flex flex-col items-center justify-center overflow-hidden transition duration-300 ease-in data-[closed]:opacity-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 transition duration-300 ease-in data-[closed]:opacity-0"
      />
    </div>
  );
};

export default ColorParticlesAnimation;

type Pattern = "circle" | "rectangle" | "spiral" | "random";

export function RotatingColorsAnimation({
  colorSets,
  theme,
  pattern,
}: {
  colorSets: string[][];
  theme?: ColorTheme;
  pattern?: Pattern;
}) {
  const [currentColorSetIndex, setCurrentColorSetIndex] = useState(0);
  const [show, setShow] = useState(true);
  pattern =
    pattern || (["circle", "rectangle", "spiral", "random"][Math.floor(Math.random() * 4)] as Pattern);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="fixed z-50 inset-0 flex flex-col items-center justify-center overflow-hidden">
      <ColorParticlesAnimation
        colors={colorSets[currentColorSetIndex]}
        theme={theme}
        pattern={pattern}
        onAnimationComplete={() => {
          console.log("Animation complete");
          // setShow(false);
          setTimeout(() => {
            setCurrentColorSetIndex((prev) => {
              if (prev === colorSets.length - 1) {
                console.log("setting to 0");
                return 0;
              }
              console.log("setting to", prev + 1);
              return prev + 1;
            });
          }, 2000); // Adjust the duration as needed
        }}
      />
    </div>
  );
}
