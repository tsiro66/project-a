// gtag.d.ts
interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
}