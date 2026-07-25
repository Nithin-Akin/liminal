import { NextResponse } from "next/server";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="#020303"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#f2f0ea" font-family="Georgia,serif" font-size="118">L</text></svg>`;

export function GET() {
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
