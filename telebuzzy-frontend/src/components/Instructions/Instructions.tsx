import { Section } from "@/components/common/Section/Section";
import { InstructionsApiKey } from "./ApiKey/InstructionsApiKey";
import { InstructionsTelegramBot } from "./TelegramBot/InstructionsTelegramBot";
import { InstructionsUsage } from "./Usage/InstructionsUsage";

export const Instructions = () => {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Start buzzing in 3 steps"
      description="Get a key, link it to your Telegram, send a request. That’s the whole integration."
    >
      <ol className="flex flex-col gap-4">
        <InstructionsApiKey />
        <InstructionsTelegramBot />
        <InstructionsUsage />
      </ol>
    </Section>
  );
};
