"use client";

import { useEffect, useMemo, useState } from "react";

function makeField() {
  const chars = [".", ".", ".", ":", "-", "<", ">", "0", "1", "/", "\\"];
  const rows = 88;
  const cols = 210;
  const lines: string[] = [];

  for (let y = 0; y < rows; y += 1) {
    let line = "";
    for (let x = 0; x < cols; x += 1) {
      const ridge = Math.sin(x * 0.035 + y * 0.11) + Math.cos(x * 0.018 - y * 0.08);
      const voidCut = Math.sin((x - 90) * 0.08) * Math.cos((y - 42) * 0.12);
      const density = ridge + voidCut;
      if (density > 0.9 || (x > 116 && x < 145 && y > 8 && y < 72)) {
        line += chars[(x + y * 3) % chars.length];
      } else if (density > 0.36) {
        line += chars[(x * 2 + y) % 5];
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }

  return lines.join("\n");
}

export function AsciiField() {
  const field = useMemo(makeField, []);
  const [offset, setOffset] = useState({ x: "0px", y: "0px" });

  useEffect(() => {
    function onMove(event: PointerEvent) {
      const x = ((event.clientX / window.innerWidth) - 0.5) * -22;
      const y = ((event.clientY / window.innerHeight) - 0.5) * -16;
      setOffset({ x: `${x}px`, y: `${y}px` });
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <pre className="ascii-field" style={{ "--mx": offset.x, "--my": offset.y } as React.CSSProperties}>
        {field}
      </pre>
      <div className="grain" />
    </>
  );
}
