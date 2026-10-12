import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="mt-6 mb-[calc(var(--tb-head-width)*0.62)] w-full max-w-5xl px-4 md:mt-10 md:px-8">
      <div className="tb-card flex flex-col items-center justify-between gap-2 px-6 py-4 text-center text-sm text-tb-ink-secondary sm:flex-row sm:text-left">
        <p>
          {"Questions? "}
          <Link
            className="font-medium text-tb-brand-blue-strong underline underline-offset-4"
            href="mailto:support@telebuzzy.xyz"
          >
            {"support@telebuzzy.xyz"}
          </Link>
        </p>
        <p>{`© ${new Date().getFullYear()} MyDAOgs Ecosystem. All rights reserved.`}</p>
      </div>
    </footer>
  );
};
