import { Button } from "@/components/ui/button";
import Link from "next/link";

export const InstructionsTelegramBot = () => {
  return (
    <li className="flex flex-col gap-0">
      <h3 className="w-full px-2 font-mono">
        {"2. Register your key in Telegram Bot"}
      </h3>
      <p className="text-center border-2 border-muted-foreground/80 bg-accent/80 py-1 px-2 rounded-md">
        {"Start the "}
        <Button>
          <Link href="https://t.me/bleadio_bot">{"@bleadio_bot"}</Link>
        </Button>
        {" and run "}
        <span className="font-semibold text-primary">
          {"/set_api_key <YOUR_KEY>"}
        </span>
        {" command."}
      </p>
    </li>
  );
};
