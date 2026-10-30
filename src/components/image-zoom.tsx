"use client";
import { useState } from "react";

export function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  function move(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }

  return (
    <>
      <div
        className="zoom-container"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onMouseMove={move}
        style={{ position: "relative", overflow: "hidden", cursor: "crosshair" }}
      >
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {show && (
        <div
          className="zoom-lens"
          style={{
            position: "absolute",
            right: "-110%",
            top: 0,
            width: "100%",
            height: "100%",
            border: "1px solid var(--border)",
            backgroundImage: `url(${src})`,
            backgroundPosition: `${pos.x}% ${pos.y}%`,
            backgroundSize: "200%",
            backgroundRepeat: "no-repeat",
            zIndex: 10,
            boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
          }}
        />
      )}
    </>
  );
}
