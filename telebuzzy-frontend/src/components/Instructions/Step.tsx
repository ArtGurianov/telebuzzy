import { ReactNode } from "react";

interface StepProps {
  id?: string;
  index: number;
  title: string;
  description: ReactNode;
  children: ReactNode;
}

/** One numbered onboarding step inside `Instructions` */
export const Step = ({
  id,
  index,
  title,
  description,
  children,
}: StepProps) => {
  return (
    <li
      id={id}
      className="grid scroll-mt-6 grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 rounded-tb-card border border-tb-border-default bg-tb-surface-white p-4 md:gap-x-5 md:p-6"
    >
      <span
        aria-hidden
        className="flex size-11 items-center justify-center rounded-full bg-tb-brand-yellow font-display text-2xl font-semibold shadow-[0_0_0_2px_var(--tb-brand-pink)]"
      >
        {index}
      </span>
      <h3 className="self-center text-xl leading-tight font-semibold">
        <span className="sr-only">{`Step ${index}: `}</span>
        {title}
      </h3>
      <p className="col-span-2 -mt-1 text-pretty text-tb-ink-secondary md:col-span-1 md:col-start-2">
        {description}
      </p>
      <div className="col-span-2 min-w-0 md:col-span-1 md:col-start-2">
        {children}
      </div>
    </li>
  );
};
