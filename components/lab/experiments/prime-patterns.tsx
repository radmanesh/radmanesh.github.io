"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// --------- TYPES ---------
interface Point {
  x: number;
  y: number;
  n: number;
  isPrime: boolean;
  primeIndex?: number;
  gap?: number;
}

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

type ColorMode = "primes" | "residue" | "gaps";

// --------- UTILS ---------
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function generatePrimes(limit: number): number[] {
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

function ulamSpiralCoords(n: number): { x: number; y: number } {
  if (n === 1) return { x: 0, y: 0 };

  // Find which ring we're in
  let ring = 0;
  let maxInRing = 1;
  while (maxInRing < n) {
    ring++;
    maxInRing = (2 * ring + 1) ** 2;
  }

  const sideLength = 2 * ring + 1;
  const prevMaxN = (2 * (ring - 1) + 1) ** 2;
  const posInRing = n - prevMaxN;

  // Start at bottom-right of previous ring
  let x = ring;
  let y = -(ring - 1);

  const sideLen = 2 * ring;

  if (posInRing <= sideLen) {
    // Moving up
    y += posInRing - 1;
  } else if (posInRing <= 2 * sideLen) {
    // Moving left
    y = ring;
    x -= (posInRing - sideLen);
  } else if (posInRing <= 3 * sideLen) {
    // Moving down
    x = -ring;
    y = ring - (posInRing - 2 * sideLen);
  } else {
    // Moving right
    y = -ring;
    x = -ring + (posInRing - 3 * sideLen);
  }

  return { x, y };
}

function getResidueColor(n: number, mod: number): string {
  const residue = n % mod;
  const hue = (residue * 360) / mod;
  return `hsl(${hue}, 70%, 60%)`;
}

function getGapColor(gap: number): string {
  if (gap <= 2) return "#22c55e"; // green for twin primes
  if (gap <= 4) return "#eab308"; // yellow for small gaps
  if (gap <= 10) return "#f97316"; // orange for medium gaps
  return "#ef4444"; // red for large gaps
}

// --------- MAIN COMPONENT ---------
export default function PrimePatterns() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 10 });
  const [colorMode, setColorMode] = useState<ColorMode>("primes");
  const [modBase, setModBase] = useState(6);
  const [pointSize, setPointSize] = useState(3);
  const [showGrid, setShowGrid] = useState(false);
  const [maxN, setMaxN] = useState(10000);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: Point } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchMode, setTouchMode] = useState<"pan" | "zoom">("pan");
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const points = useRef<Point[]>([]);
  const primes = useRef<number[]>([]);

  // Set responsive canvas size based on container width to avoid horizontal overflow
  useEffect(() => {
    const updateCanvasSize = () => {
      const parentWidth = containerRef.current?.clientWidth ?? (typeof window !== "undefined" ? window.innerWidth : 800);
      // Keep aspect 4:3 like 800x600, clamp to parent width and sensible bounds
      const clampedW = Math.max(240, Math.min(800, Math.floor(parentWidth)));
      const clampedH = Math.max(240, Math.min(600, Math.round((clampedW * 3) / 4)));
      setCanvasSize({ width: clampedW, height: clampedH });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Generate points when maxN changes
  useEffect(() => {
    primes.current = generatePrimes(maxN);
    const primeSet = new Set(primes.current);
    const newPoints: Point[] = [];

    for (let n = 1; n <= maxN; n++) {
      const coords = ulamSpiralCoords(n);
      const isPrimeN = primeSet.has(n);
      const primeIndex = isPrimeN ? primes.current.indexOf(n) : undefined;

      // Calculate gap for primes
      let gap: number | undefined;
      if (isPrimeN && primeIndex !== undefined && primeIndex > 0) {
        gap = primes.current[primeIndex] - primes.current[primeIndex - 1];
      }

      newPoints.push({
        x: coords.x,
        y: coords.y,
        n,
        isPrime: isPrimeN,
        primeIndex,
        gap,
      });
    }

    points.current = newPoints;
  }, [maxN]);

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Transform context
    ctx.save();
    ctx.translate(width / 2 + viewport.x, height / 2 + viewport.y);
    ctx.scale(viewport.scale, viewport.scale);

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 0.5 / viewport.scale;
      const gridSize = 1;
      const startX = Math.floor((-width / 2 - viewport.x) / viewport.scale / gridSize) * gridSize;
      const endX = Math.ceil((width / 2 - viewport.x) / viewport.scale / gridSize) * gridSize;
      const startY = Math.floor((-height / 2 - viewport.y) / viewport.scale / gridSize) * gridSize;
      const endY = Math.ceil((height / 2 - viewport.y) / viewport.scale / gridSize) * gridSize;

      for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }

      for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
    }

    // Draw points
    const radius = pointSize / viewport.scale;

    points.current.forEach((point) => {
      let color = "#6b7280"; // default gray

      if (colorMode === "primes" && point.isPrime) {
        color = "#3b82f6"; // blue for primes
      } else if (colorMode === "residue") {
        color = getResidueColor(point.n, modBase);
      } else if (colorMode === "gaps" && point.isPrime && point.gap) {
        color = getGapColor(point.gap);
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, -point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, [viewport, colorMode, modBase, pointSize, showGrid]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Redraw when data or canvas dimensions change (e.g., on first load)
  useEffect(() => {
    draw();
  }, [maxN, canvasSize.width, canvasSize.height]);

  // Ensure preventDefault works across browsers by attaching non-passive listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    const preventTouchStart = (e: TouchEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener("wheel", preventWheel, { passive: false });
    canvas.addEventListener("touchmove", preventTouchMove, { passive: false });
    canvas.addEventListener("touchstart", preventTouchStart, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", preventWheel as EventListener);
      canvas.removeEventListener("touchmove", preventTouchMove as EventListener);
      canvas.removeEventListener("touchstart", preventTouchStart as EventListener);
    };
  }, []);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setViewport(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    } else {
      // Handle tooltip
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert to world coordinates
      const worldX = (mouseX - canvas.width / 2 - viewport.x) / viewport.scale;
      const worldY = -((mouseY - canvas.height / 2 - viewport.y) / viewport.scale);

      // Find closest point
      let closest: Point | null = null;
      let minDist = Infinity;

      points.current.forEach((point) => {
        const dist = Math.sqrt((point.x - worldX) ** 2 + (point.y - worldY) ** 2);
        if (dist < minDist && dist < 0.5) {
          minDist = dist;
          closest = point;
        }
      });

      if (closest) {
        setTooltip({ x: mouseX, y: mouseY, point: closest });
      } else {
        setTooltip(null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport(prev => ({
      ...prev,
      scale: Math.max(1, Math.min(100, prev.scale * scaleFactor)),
    }));
  };

  // Prevent parent/page scrolling while hovering over canvas container
  const handleContainerWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - viewport.x, y: touch.clientY - viewport.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];

      if (touchMode === "pan") {
        setViewport(prev => ({
          ...prev,
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        }));
      } else if (touchMode === "zoom") {
        // Zoom based on vertical movement
        const deltaY = touch.clientY - dragStart.y;
        const scaleFactor = deltaY > 0 ? 0.99 : 1.01;
        setViewport(prev => ({
          ...prev,
          scale: Math.max(1, Math.min(100, prev.scale * scaleFactor)),
        }));
        setDragStart({ x: touch.clientX - viewport.x, y: touch.clientY - viewport.y });
      }
    }
  };

  const handleTouchEnd = (e?: React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
  };

  const resetView = () => {
    setViewport({ x: 0, y: 0, scale: 10 });
  };

  return (
  <div className="space-y-4 overflow-x-hidden max-w-full">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm min-w-0">
        <div className="space-y-2">
          <label className="block text-muted-foreground">Color Mode</label>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
            className="w-full px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background"
          >
            <option value="primes">Primes</option>
            <option value="residue">Residue Classes</option>
            <option value="gaps">Prime Gaps</option>
          </select>
        </div>

        {colorMode === "residue" && (
          <div className="space-y-2">
            <label className="block text-muted-foreground">Mod Base</label>
            <input
              type="number"
              value={modBase}
              onChange={(e) => setModBase(Number(e.target.value))}
              min="2"
              max="30"
              className="w-full px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-muted-foreground">Point Size</label>
          <input
            type="range"
            value={pointSize}
            onChange={(e) => setPointSize(Number(e.target.value))}
            min="1"
            max="8"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-muted-foreground">Max N</label>
          <input
            type="number"
            value={maxN}
            onChange={(e) => setMaxN(Number(e.target.value))}
            min="100"
            max="1000000"
            step="1000"
            className="w-full px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background"
          />
        </div>
      </div>

      {/* Mobile Touch Mode Controls */}
      <div className="md:hidden">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setTouchMode("pan")}
            className={`px-3 py-1 rounded border text-sm ${
              touchMode === "pan"
                ? "bg-blue-500 text-white border-blue-500"
                : "border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            Pan Mode
          </button>
          <button
            onClick={() => setTouchMode("zoom")}
            className={`px-3 py-1 rounded border text-sm ${
              touchMode === "zoom"
                ? "bg-blue-500 text-white border-blue-500"
                : "border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            Zoom Mode
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {touchMode === "pan" ? "Touch and drag to move around" : "Touch and drag up/down to zoom in/out"}
        </p>
      </div>

  <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm"
        >
          {showGrid ? "Hide" : "Show"} Grid
        </button>

        <button
          onClick={resetView}
          className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm"
        >
          Reset View
        </button>
      </div>

    {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex justify-center w-full max-w-full overflow-x-hidden overscroll-none"
        onWheel={handleContainerWheel}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="block max-w-full border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-move touch-none overscroll-none select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setTooltip(null);
          }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
            }}
          >
            <div>n = {tooltip.point.n}</div>
            <div>({tooltip.point.x}, {tooltip.point.y})</div>
            <div>{tooltip.point.isPrime ? "Prime" : "Composite"}</div>
            {tooltip.point.isPrime && tooltip.point.primeIndex !== undefined && (
              <div>π({tooltip.point.n}) = {tooltip.point.primeIndex + 1}</div>
            )}
            {tooltip.point.gap && (
              <div>Gap: {tooltip.point.gap}</div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p><strong>Desktop:</strong> Scroll to zoom, drag to pan, hover for details</p>
        <p className="md:hidden"><strong>Mobile:</strong> Use mode buttons above, then touch and drag</p>
        <p><strong>Primes:</strong> Blue dots show prime numbers</p>
        <p><strong>Residue Classes:</strong> Colors by n mod m</p>
        <p><strong>Prime Gaps:</strong> Colors by gap to next prime (green=twins, red=large)</p>
      </div>
    </div>
  );
}
