import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Landing page section on a readable card surface over the backdrop */
export const Section = ({
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionProps) => {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "tb-card flex scroll-mt-6 flex-col gap-6 px-5 py-8 md:gap-8 md:px-10 md:py-10",
        className
      )}
    >
      <header className="flex flex-col items-center gap-2 text-center">
        {eyebrow ? (
          <p className="text-sm font-semibold tracking-wide text-tb-pink-text uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={titleId}
          className="font-display text-3xl leading-tight font-semibold text-balance md:text-4xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-base text-pretty text-tb-ink-secondary md:text-lg">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
};
