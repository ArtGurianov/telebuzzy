import Image from "next/image";
import { BleadSvgUrl } from "../svg";

export const Hero = () => {
  return (
    <div className="flex flex-wrap-reverse justify-center items-center gap-2 grow w-full">
      <div className="grow">
        <Image
          src={BleadSvgUrl}
          width="0"
          height="0"
          sizes="100vw"
          alt="logo"
          className="h-auto w-full shrink-0"
          priority
        />
      </div>
      <div className="font-mono text-2xl">
        <p className="text-primary md:text-end font-semibold">
          {"Got your lead?"}
        </p>
        <p className="text-primary md:text-end font-semibold">
          {"Don’t let em bleed!"}
        </p>
        <p className="font-serif mt-4 text-3xl flex gap-1 md:flex-col flex-row justify-center items-center md:items-end text-nowrap">
          <span>{"Act fast with"}</span>
          <span>{"BLEAD.io"}</span>
        </p>
      </div>
    </div>
  );
};
