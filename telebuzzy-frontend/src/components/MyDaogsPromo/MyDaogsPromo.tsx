import Image from "next/image";
import Link from "next/link";

export const MyDaogsPromo = () => {
  return (
    <div className="flex gap-0 justify-center items-center">
      <Link href={`https://mydaogs.xyz`}>
        <Image
          src="/mydaogs-ecosystem.png"
          width="0"
          height="0"
          sizes="100vw"
          alt="MyDaogs"
          className="h-auto min-w-[144px] shrink-0 grow"
          priority
        />
      </Link>
      <p className="text-md font-serif text-center text-primary font-light">
        {"The whole revenue is getting distributed to MyDAOgs stakeholders. "}
        <span className="underline">
          {<Link href={`https://mydaogs.xyz`}>{"learn more"}</Link>}
        </span>
      </p>
    </div>
  );
};
