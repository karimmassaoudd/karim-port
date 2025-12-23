import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";

export default function AboutPage() {
  return (
    <>
      <Header />
      <PageAnimator>
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-primary mb-4">About</h1>
          <p className="text-[var(--secondary-text)]">
            This is a placeholder page for About.
          </p>
        </section>
      </PageAnimator>
      <Footer />
    </>
  );
}
