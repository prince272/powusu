import { title } from "@/components/primitives";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About"
}
 

export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
    </div>
  );
}
