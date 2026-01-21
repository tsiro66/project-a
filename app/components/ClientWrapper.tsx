"use client";

import { useState } from "react";
import Preloader from "./Preloader";
import SmoothScroll from "./SmoothScroll";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <SmoothScroll stop={isLoading}>
        {children}
      </SmoothScroll>
    </>
  );
}