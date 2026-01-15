import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";
import ProjectDetails from "@/components/ProjectDetails";

export default function ProjectDetailsPage() {
  return (
    <>
      <Header />
      <PageAnimator>
        <ProjectDetails enableAnimations={false} />
      </PageAnimator>
      <Footer />
    </>
  );
}
