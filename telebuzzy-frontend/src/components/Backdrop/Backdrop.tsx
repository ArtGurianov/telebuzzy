import Image from "next/image";

/**
 * Fixed brand world behind every page: the landscape always spans the
 * viewport top to bottom (narrow screens see its middle vertical slice),
 * the logo floats near the top and the head peeks up from below the screen.
 * Purely decorative, so it is hidden from assistive tech.
 */
export const Backdrop = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden select-none"
    >
      <Image
        src="/tt-bg.webp"
        alt=""
        fill
        priority
        // Height-fitted on portrait screens, so it can be wider than 100vw
        sizes="max(100vw, 178vh)"
        className="object-cover object-center"
      />
      <div
        className="tb-logo-enter absolute left-1/2 -translate-x-1/2"
        style={{
          top: "var(--tb-logo-top)",
          width: "var(--tb-logo-width)",
        }}
      >
        <div className="tb-logo-bob">
          <Image
            src="/tt-logo.webp"
            alt=""
            width={1672}
            height={941}
            sizes="(min-width: 768px) 36rem, 88vw"
            className="h-auto w-full drop-shadow-[0_12px_18px_rgb(24_38_63/0.25)]"
          />
        </div>
      </div>
      <div
        className="tb-head-enter absolute bottom-0 left-1/2 -ml-[calc(var(--tb-head-width)/2)]"
        style={{ width: "var(--tb-head-width)" }}
      >
        <div className="tb-head-bob">
          <Image
            src="/tt-head.webp"
            alt=""
            width={1024}
            height={827}
            sizes="(min-width: 768px) 22rem, 64vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
};
