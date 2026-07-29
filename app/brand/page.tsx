import type { Metadata } from "next";
import BrandStudio from "./BrandStudio";

export const metadata: Metadata = {
  title: "Aerivis Brand Lab | Live Identity Demo",
  description:
    "An interactive review of the Aerivis identity across sizes, colour modes and real product applications.",
};

export default function BrandPage() {
  return <BrandStudio />;
}
