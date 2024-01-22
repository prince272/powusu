import { FC } from "react";

const CoursesPage: FC = () => {
  return (
    <>
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="font-heading text-3xl md:text-4xl">Courses</h1>
            <p className="text-muted-foreground text-lg">Create and manage courses.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export { CoursesPage };
