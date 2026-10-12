import Image from "next/image";
import Link from "next/link";

export const MyDaogsPromo = () => {
  return (
    <div className="flex items-center justify-center gap-3 rounded-tb-card bg-tb-surface-white p-3">
      <Link href={`https://mydaogs.xyz`}>
        <Image
          src="/mydaogs-ecosystem.png"
          width="0"
          height="0"
          sizes="100vw"
          alt="MyDaogs"
          className="h-auto w-36 shrink-0"
        />
      </Link>
      <p className="text-sm text-pretty text-tb-ink-secondary">
        {"All revenue is distributed to MyDAOgs stakeholders. "}
        <Link
          className="font-medium text-tb-brand-blue-strong underline underline-offset-4"
          href={`https://mydaogs.xyz`}
        >
          {"Learn more"}
        </Link>
      </p>
    </div>
  );
};
