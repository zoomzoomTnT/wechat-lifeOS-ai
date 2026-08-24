import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/skills")({ component: SkillsLayout });

function SkillsLayout() {
  return (
    <div className="flex flex-col gap-8">
      <Outlet />
    </div>
  );
}
