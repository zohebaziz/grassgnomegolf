"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useEffect, useState, useCallback } from "react";

interface DragState {
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
  dragPosition: { x: number; y: number } | null;
}

interface OvalObstacle {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

interface Level {
  ballStart: { x: number; y: number };
  hole: { x: number; y: number; radius: number };
  waterHazards: OvalObstacle[];
  sandTraps: OvalObstacle[];
}

const generateLevel = (width: number, height: number): Level => {
  const ballStart = { x: Math.random() * 100 + 50, y: Math.random() * (height - 100) + 50 };
  const hole = { x: Math.random() * 100 + (width - 150), y: Math.random() * (height - 100) + 50, radius: 10 };
  const waterHazards: OvalObstacle[] = [];
  const sandTraps: OvalObstacle[] = [];

  // Generate water hazard
  if (Math.random() > 0.5) {
    waterHazards.push({ 
      x: Math.random() * (width - 400) + 200, 
      y: Math.random() * (height - 100) + 50, 
      radiusX: Math.random() * 30 + 20, 
      radiusY: Math.random() * 30 + 20 
    });
  }

  // Generate sand traps
  const numSandTraps = Math.floor(Math.random() * 3);
  for (let i = 0; i < numSandTraps; i++) {
    sandTraps.push({ 
      x: Math.random() * (width - 400) + 200, 
      y: Math.random() * (height - 100) + 50, 
      radiusX: Math.random() * 40 + 30, 
      radiusY: Math.random() * 40 + 30 
    });
  }

  return { ballStart, hole, waterHazards, sandTraps };
};

export default function GolfGame() {
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const ballRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const lastBallPosition = useRef({ x: 0, y: 0 });
  const [shots, setShots] = useState(0);
  const [holeInOne, setHoleInOne] = useState(false);
  const particlesRef = useRef<any[]>([]);

  const stateRef = useRef<DragState>({ isDragging: false, dragStart: null, dragPosition: null });

  const [isShootable, setIsShootable] = useState(true);

  const maxDragDistance = 100;

  const handleRestart = () => {
    const canvas = canvasRef.current!;
    setLevel(generateLevel(canvas.width, canvas.height));
    setShots(0);
    setHoleInOne(false);
  };


  useEffect(() => {
    const allowed = localStorage.getItem("canPlayGnolf");
    if (allowed !== "true") {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    handleRestart();
  }, []);

  useEffect(() => {
    if (!level) return;
    ballRef.current = { x: level.ballStart.x, y: level.ballStart.y, vx: 0, vy: 0 };
    lastBallPosition.current = { x: level.ballStart.x, y: level.ballStart.y };
  }, [level]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (holeInOne || !isShootable) return;
    lastBallPosition.current = { x: ballRef.current.x, y: ballRef.current.y };
    stateRef.current.dragStart = { x: e.clientX, y: e.clientY };
    stateRef.current.dragPosition = { x: e.clientX, y: e.clientY };
    stateRef.current.isDragging = true;
  }, [holeInOne, isShootable]);

  useEffect(() => {
    if (!level) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rollingFriction = 0.01;
    const sandFrictionHigh = 0.3;
    const sandFrictionLow = 0.05;
    const restitution = 0.6;
    const stopThreshold = 0.1;
    const holeGravity = 0.05;
    const catchRadius = level.hole.radius * 3;
    const catchSpeed = 3;
    const highSpeedThreshold = 5;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sand traps
      ctx.fillStyle = "#FDE68A";
      level.sandTraps.forEach(trap => {
        ctx.beginPath();
        ctx.ellipse(trap.x, trap.y, trap.radiusX, trap.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw water hazards
      ctx.fillStyle = "#60A5FA";
      level.waterHazards.forEach(hazard => {
        ctx.beginPath();
        ctx.ellipse(hazard.x, hazard.y, hazard.radiusX, hazard.radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw hole
      ctx.beginPath();
      ctx.arc(level.hole.x, level.hole.y, level.hole.radius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      // Update ball position
      let ball = ballRef.current;
      if (!holeInOne) {
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        let friction = rollingFriction;
        let inSand = false;
        level.sandTraps.forEach(trap => {
          const dx = ball.x - trap.x;
          const dy = ball.y - trap.y;
          if ((dx * dx) / (trap.radiusX * trap.radiusX) + (dy * dy) / (trap.radiusY * trap.radiusY) < 1) {
            inSand = true;
          }
        });

        if (inSand) {
          friction = speed > highSpeedThreshold ? sandFrictionHigh : sandFrictionLow;
          if (speed > 0.1) {
            for (let i = 0; i < 5; i++) {
              particlesRef.current.push({ x: ball.x, y: ball.y, vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5, life: 30, color: `rgba(253, 230, 138, ${Math.random() * 0.5 + 0.5})` });
            }
          }
        }

        if (speed > 0) {
          const frictionForce = speed * friction;
          ball.vx -= (ball.vx / speed) * frictionForce;
          ball.vy -= (ball.vy / speed) * frictionForce;
        }

        const dxToHole = level.hole.x - ball.x;
        const dyToHole = level.hole.y - ball.y;
        const distToHole = Math.sqrt(dxToHole * dxToHole + dyToHole * dyToHole);

        if (distToHole < catchRadius && speed < catchSpeed && speed > 0) {
          ball.vx += dxToHole * holeGravity;
          ball.vy += dyToHole * holeGravity;
        }

        ball.x += ball.vx;
        ball.y += ball.vy;
      }

      // Water hazard collision
      level.waterHazards.forEach(hazard => {
        const dx = ball.x - hazard.x;
        const dy = ball.y - hazard.y;
        if ((dx * dx) / (hazard.radiusX * hazard.radiusX) + (dy * dy) / (hazard.radiusY * hazard.radiusY) < 1) {
          for (let i = 0; i < 20; i++) {
            particlesRef.current.push({ x: ball.x, y: ball.y, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, life: 50, color: `rgba(96, 165, 250, ${Math.random()})` });
          }
          ball.x = lastBallPosition.current.x;
          ball.y = lastBallPosition.current.y;
          ball.vx = 0; ball.vy = 0;
        }
      });

      // Bounce off canvas walls
      if (ball.x < 8) { ball.x = 8; ball.vx *= -restitution; }
      else if (ball.x > canvas.width - 8) { ball.x = canvas.width - 8; ball.vx *= -restitution; }
      if (ball.y < 8) { ball.y = 8; ball.vy *= -restitution; }
      else if (ball.y > canvas.height - 8) { ball.y = canvas.height - 8; ball.vy *= -restitution; }

      // Check hole collision
      const dx = ball.x - level.hole.x;
      const dy = ball.y - level.hole.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);

      if (dist < level.hole.radius && !holeInOne) {
        if (speed < catchSpeed) {
          ball.vx = 0; ball.vy = 0;
          setHoleInOne(true);
          for (let i = 0; i < 100; i++) {
            particlesRef.current.push({ x: level.hole.x, y: level.hole.y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 100, color: `hsl(${Math.random() * 360}, 100%, 50%)` });
          }
          setTimeout(() => {
            handleRestart();
          }, 2000);
        } else {
          for (let i = 0; i < 10; i++) {
            particlesRef.current.push({ x: ball.x, y: ball.y, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 3, life: 50, color: `rgba(255, 255, 0, ${Math.random()})` });
          }
          ball.vy *= -0.5;
          ball.vx *= 0.5;
        }
      }

      // Update and draw particles
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) particlesRef.current.splice(i, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life / 10, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Stop ball if nearly still
      if (speed < stopThreshold) { ball.vx = 0; ball.vy = 0; setIsShootable(true); }
      else { setIsShootable(false); }

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = holeInOne ? "gold" : (isShootable ? "white" : "rgba(255, 255, 255, 0.5)");
      ctx.fill();
      ctx.strokeStyle = "gray";
      ctx.stroke();

      // Draw power indicator
      if (stateRef.current.isDragging && stateRef.current.dragStart && stateRef.current.dragPosition) {
        let dragDx = stateRef.current.dragPosition.x - stateRef.current.dragStart.x;
        let dragDy = stateRef.current.dragPosition.y - stateRef.current.dragStart.y;
        const dragDist = Math.sqrt(dragDx * dragDx + dragDy * dragDy);
        if (dragDist > maxDragDistance) {
          const angle = Math.atan2(dragDy, dragDx);
          dragDx = Math.cos(angle) * maxDragDistance;
          dragDy = Math.sin(angle) * maxDragDistance;
        }
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x - dragDx, ball.y - dragDy);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();
      }

      // Draw hole in one message
      if (holeInOne) {
        ctx.font = "40px Arial";
        ctx.fillStyle = "gold";
        ctx.textAlign = "center";
        ctx.fillText(`Score: ${shots}`, canvas.width / 2, canvas.height / 2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [level, holeInOne, isShootable]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      stateRef.current.dragPosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      if (!stateRef.current.isDragging || !stateRef.current.dragStart || !stateRef.current.dragPosition) return;
      stateRef.current.isDragging = false;

      let dx = stateRef.current.dragPosition.x - stateRef.current.dragStart.x;
      let dy = stateRef.current.dragPosition.y - stateRef.current.dragStart.y;
      const dragDist = Math.sqrt(dx * dx + dy * dy);

      if (dragDist > maxDragDistance) {
        const angle = Math.atan2(dy, dx);
        dx = Math.cos(angle) * maxDragDistance;
        dy = Math.sin(angle) * maxDragDistance;
      }

      ballRef.current.vx = -dx / 10;
      ballRef.current.vy = -dy / 10;
      stateRef.current.dragStart = null;
      stateRef.current.dragPosition = null;
      setShots((s) => s + 1);
      setIsShootable(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-700">
      <h1 className="text-4xl font-bold text-white mb-2">2D Gnolf ⛳</h1>
      <p className="text-white mb-4 text-sm">Shots: {shots}</p>
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        className="bg-green-600 rounded-lg shadow-lg cursor-crosshair"
        onMouseDown={handleMouseDown}
      />
      <p className="text-white mt-4 text-sm">Click & drag to shoot the ball!</p>
      <button onClick={handleRestart} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-blue-600">
        New Level
      </button>
    </div>
  );
}