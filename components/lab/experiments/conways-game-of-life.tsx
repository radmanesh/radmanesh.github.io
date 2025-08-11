"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// --------- TYPES ---------
type Mode = "design" | "run";

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

interface GameState {
  grid: boolean[][];
  width: number;
  height: number;
}

// --------- UTILS ---------
function createEmptyGrid(width: number, height: number): boolean[][] {
  return Array(height).fill(null).map(() => Array(width).fill(false));
}

function countNeighbors(grid: boolean[][], x: number, y: number): number {
  let count = 0;
  const height = grid.length;
  const width = grid[0].length;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (grid[ny][nx]) count++;
      }
    }
  }

  return count;
}

function nextGeneration(grid: boolean[][]): boolean[][] {
  const height = grid.length;
  const width = grid[0].length;
  const newGrid = createEmptyGrid(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighbors = countNeighbors(grid, x, y);
      const isAlive = grid[y][x];

      if (isAlive) {
        // Live cell survives with 2 or 3 neighbors
        newGrid[y][x] = neighbors === 2 || neighbors === 3;
      } else {
        // Dead cell becomes alive with exactly 3 neighbors
        newGrid[y][x] = neighbors === 3;
      }
    }
  }

  return newGrid;
}

// Common patterns
const PATTERNS = {
  glider: [
    [false, true, false],
    [false, false, true],
    [true, true, true]
  ],
  blinker: [
    [true, true, true]
  ],
  block: [
    [true, true],
    [true, true]
  ],
  toad: [
    [false, true, true, true],
    [true, true, true, false]
  ]
};

// --------- MAIN COMPONENT ---------
export default function ConwaysGameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Constants for grid size and zoom limits
  const GRID_WIDTH = 500; // 10x larger than visible area
  const GRID_HEIGHT = 500; // 10x larger than visible area
  const MIN_ZOOM = 1; // Can zoom out to see entire grid
  const MAX_ZOOM = 100; // Can zoom in to see individual cells clearly

  // State
  const [mode, setMode] = useState<Mode>("design");
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 20 });
  const [gameState, setGameState] = useState<GameState>(() => ({
    grid: createEmptyGrid(GRID_WIDTH, GRID_HEIGHT),
    width: GRID_WIDTH,
    height: GRID_HEIGHT
  }));
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(200); // ms between generations
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<"alive" | "dead">("alive");

  // Set responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      const parentWidth = containerRef.current?.clientWidth ?? 800;
      const clampedW = Math.max(320, Math.min(800, Math.floor(parentWidth)));
      const clampedH = Math.max(240, Math.min(600, Math.round((clampedW * 3) / 4)));
      setCanvasSize({ width: clampedW, height: clampedH });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Animation loop for running mode
  useEffect(() => {
    if (mode === "run" && isRunning) {
      const animate = () => {
        setGameState(prev => ({
          ...prev,
          grid: nextGeneration(prev.grid)
        }));
        setGeneration(g => g + 1);
        animationRef.current = window.setTimeout(animate, speed);
      };

      animationRef.current = window.setTimeout(animate, speed);

      return () => {
        if (animationRef.current) {
          window.clearTimeout(animationRef.current);
        }
      };
    }
  }, [mode, isRunning, speed]);

  // Draw canvas
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

    // Calculate visible area to optimize rendering
    const cellSize = 1;
    const gridWidth = gameState.width * cellSize;
    const gridHeight = gameState.height * cellSize;

    // Calculate which cells are visible
    const viewLeft = (-width / 2 - viewport.x) / viewport.scale + gridWidth / 2;
    const viewRight = (width / 2 - viewport.x) / viewport.scale + gridWidth / 2;
    const viewTop = (-height / 2 - viewport.y) / viewport.scale + gridHeight / 2;
    const viewBottom = (height / 2 - viewport.y) / viewport.scale + gridHeight / 2;

    const startX = Math.max(0, Math.floor(viewLeft));
    const endX = Math.min(gameState.width, Math.ceil(viewRight));
    const startY = Math.max(0, Math.floor(viewTop));
    const endY = Math.min(gameState.height, Math.ceil(viewBottom));

    // Grid background (only draw visible portion)
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(-gridWidth / 2, -gridHeight / 2, gridWidth, gridHeight);

    // Grid lines (only draw if zoomed in enough)
    if (viewport.scale > 5) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 0.05;

      // Vertical lines
      for (let x = startX; x <= endX; x++) {
        ctx.beginPath();
        ctx.moveTo(-gridWidth / 2 + x * cellSize, -gridHeight / 2);
        ctx.lineTo(-gridWidth / 2 + x * cellSize, gridHeight / 2);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = startY; y <= endY; y++) {
        ctx.beginPath();
        ctx.moveTo(-gridWidth / 2, -gridHeight / 2 + y * cellSize);
        ctx.lineTo(gridWidth / 2, -gridHeight / 2 + y * cellSize);
        ctx.stroke();
      }
    }

    // Draw cells (only visible ones)
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (y >= 0 && y < gameState.height && x >= 0 && x < gameState.width && gameState.grid[y][x]) {
          ctx.fillStyle = mode === "design" ? "#3b82f6" : "#22c55e";
          ctx.fillRect(
            -gridWidth / 2 + x * cellSize,
            -gridHeight / 2 + y * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }

    ctx.restore();
  }, [viewport, gameState, mode]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Convert canvas coordinates to grid coordinates
  const canvasToGrid = useCallback((canvasX: number, canvasY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = canvasX - rect.left;
    const y = canvasY - rect.top;

    const worldX = (x - canvas.width / 2 - viewport.x) / viewport.scale;
    const worldY = (y - canvas.height / 2 - viewport.y) / viewport.scale;

    const gridX = Math.floor(worldX + gameState.width / 2);
    const gridY = Math.floor(worldY + gameState.height / 2);

    if (gridX >= 0 && gridX < gameState.width && gridY >= 0 && gridY < gameState.height) {
      return { x: gridX, y: gridY };
    }
    return null;
  }, [viewport, gameState.width, gameState.height]);

  // Toggle cell at grid position
  const toggleCell = useCallback((gridX: number, gridY: number) => {
    if (mode !== "design") return;

    setGameState(prev => {
      const newGrid = prev.grid.map(row => [...row]);
      newGrid[gridY][gridX] = drawMode === "alive" ? true : false;
      return { ...prev, grid: newGrid };
    });
  }, [mode, drawMode]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "design") {
      const gridPos = canvasToGrid(e.clientX, e.clientY);
      if (gridPos) {
        const currentState = gameState.grid[gridPos.y][gridPos.x];
        setDrawMode(currentState ? "dead" : "alive");
        setIsDrawing(true);
        toggleCell(gridPos.x, gridPos.y);
      }
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === "design" && isDrawing) {
      const gridPos = canvasToGrid(e.clientX, e.clientY);
      if (gridPos) {
        toggleCell(gridPos.x, gridPos.y);
      }
    } else if (mode === "run" && isDragging) {
      setViewport(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDrawing(false);
  };

  // Zoom functionality
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;

    setViewport(prev => {
      const { width, height } = canvas;
      const wx = (mouseX - width / 2 - prev.x) / prev.scale;
      const wy = (mouseY - height / 2 - prev.y) / prev.scale;

      const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.scale * scaleFactor));
      if (newScale === prev.scale) return prev;

      const nx = mouseX - width / 2 - newScale * wx;
      const ny = mouseY - height / 2 - newScale * wy;

      return { ...prev, x: nx, y: ny, scale: newScale };
    });
  };

  // Control functions
  const clearGrid = () => {
    setGameState(prev => ({
      ...prev,
      grid: createEmptyGrid(prev.width, prev.height)
    }));
    setGeneration(0);
  };

  const randomize = () => {
    setGameState(prev => ({
      ...prev,
      grid: prev.grid.map(row => row.map(() => Math.random() < 0.3))
    }));
    setGeneration(0);
  };

  const addPattern = (patternName: keyof typeof PATTERNS, centerX: number, centerY: number) => {
    const pattern = PATTERNS[patternName];
    setGameState(prev => {
      const newGrid = prev.grid.map(row => [...row]);
      const startY = centerY - Math.floor(pattern.length / 2);
      const startX = centerX - Math.floor(pattern[0].length / 2);

      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
          const gridY = startY + y;
          const gridX = startX + x;
          if (gridY >= 0 && gridY < prev.height && gridX >= 0 && gridX < prev.width) {
            newGrid[gridY][gridX] = pattern[y][x];
          }
        }
      }

      return { ...prev, grid: newGrid };
    });
  };

  const resetView = () => {
    setViewport({ x: 0, y: 0, scale: 20 });
  };

  const fitToScreen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const padding = 50;
    const scaleX = (canvas.width - padding) / gameState.width;
    const scaleY = (canvas.height - padding) / gameState.height;
    const scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(scaleX, scaleY)));

    setViewport({ x: 0, y: 0, scale });
  };

  const toggleMode = () => {
    setMode(prev => prev === "design" ? "run" : "design");
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={toggleMode}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              mode === "design"
                ? "bg-blue-500 text-white border-blue-500"
                : "border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            Design Mode
          </button>
          <button
            onClick={toggleMode}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              mode === "run"
                ? "bg-green-500 text-white border-green-500"
                : "border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            Run Mode
          </button>
        </div>

        <div className="text-sm text-muted-foreground">
          Generation: <span className="font-mono">{generation}</span> |
          Zoom: <span className="font-mono">{viewport.scale.toFixed(1)}x</span> |
          Grid: <span className="font-mono">{gameState.width}×{gameState.height}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 text-sm">
        {mode === "design" && (
          <>
            <button
              onClick={clearGrid}
              className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
            <button
              onClick={randomize}
              className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Random
            </button>
            {Object.keys(PATTERNS).map(patternName => (
              <button
                key={patternName}
                onClick={() => addPattern(patternName as keyof typeof PATTERNS, Math.floor(gameState.width / 2), Math.floor(gameState.height / 2))}
                className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800 capitalize"
              >
                Add {patternName}
              </button>
            ))}
          </>
        )}

        {mode === "run" && (
          <>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1 rounded border ${
                isRunning
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-green-500 text-white border-green-500"
              }`}
            >
              {isRunning ? "Pause" : "Play"}
            </button>
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground">Speed:</label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-muted-foreground">{speed}ms</span>
            </div>
          </>
        )}

        <button
          onClick={resetView}
          className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Reset View
        </button>
        <button
          onClick={fitToScreen}
          className="px-3 py-1 rounded border border-zinc-200 dark:border-zinc-700 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          Fit to Screen
        </button>
      </div>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground space-y-1">
        {mode === "design" ? (
          <>
            <p><strong>Design Mode:</strong> Click and drag to toggle cells, scroll to zoom (1x-100x)</p>
            <p>Use patterns or random to get started, then switch to Run Mode. Large grid: {gameState.width}×{gameState.height} cells</p>
          </>
        ) : (
          <>
            <p><strong>Run Mode:</strong> Watch the cellular automaton evolve, drag to pan, scroll to zoom (1x-100x)</p>
            <p>Rules: Live cells with 2-3 neighbors survive, dead cells with 3 neighbors become alive</p>
          </>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex justify-center w-full max-w-full overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="block max-w-full border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-crosshair touch-none select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: mode === "design" ? "crosshair" : "grab"
          }}
        />
      </div>
    </div>
  );
}
