import Home from "@/components/Home";

// Enable static generation with revalidation
export const revalidate = 60;

export default function HomePage() {
  return <Home />;
}
