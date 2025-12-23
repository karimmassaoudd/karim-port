import PageAnimator from "@/components/PageAnimator";
import ProjectDetails from "@/components/ProjectDetails";

export default function ProjectDetailsPage() {
  return (
    <PageAnimator>
      <ProjectDetails enableAnimations={false} />
    </PageAnimator>
  );
}
