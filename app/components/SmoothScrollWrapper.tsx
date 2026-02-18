"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const SmoothScroll = dynamic(() => import("./SmoothScroll"), {
  ssr: false,
});

export default function SmoothScrollWrapper({ children }: { children: ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>;
}