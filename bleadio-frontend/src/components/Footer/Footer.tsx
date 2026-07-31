"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <div className="w-full h-8 px-4 bg-foreground/80 flex gap-2 justify-center items-center text-accent/80 text-center text-wrap font-mono text-xs">
      <span>
        {"Contact us: "}
        <Link
          className="underline text-accent"
          href={"mailto:support@blead.io"}
        >
          {"support@blead.io"}
        </Link>
      </span>
      <span>{`MyDAOgs Ecosystem ${new Date().getFullYear()}. Rights reserved.`}</span>
    </div>
  );
};
