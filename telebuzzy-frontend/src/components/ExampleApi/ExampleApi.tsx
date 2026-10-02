import Image from "next/image";

export const ExampleApi = () => {
  return (
    <div className="flex w-full flex-col gap-4 justify-center items-center mt-6">
      <h2 className="text-center text-3xl font-serif">{"Example usage:"}</h2>
      <div className="grow w-full">
        <Image
          src={"/example-api.png"}
          width="0"
          height="0"
          sizes="100vw"
          alt="logo"
          className="h-auto w-full shrink-0 rounded-lg"
          priority
        />
      </div>
    </div>
  );
};
