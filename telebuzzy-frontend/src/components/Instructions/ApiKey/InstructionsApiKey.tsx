import { InlineInfo } from "@/components/common/InlineInfo/InlineInfo";
import { ApiKeyControls } from "./ApiKeyControls";

export const InstructionsApiKey = () => {
  return (
    <li className="flex flex-col gap-0">
      <h3 className="w-full px-2 font-mono">{"1. Get Api key"}</h3>
      <InlineInfo
        className="lg:min-w-[520px]"
        label="API KEY"
        description={
          "Make sure to store it as secret variable. Do not reveal/commit to public repositories."
        }
      >
        <ApiKeyControls />
      </InlineInfo>
    </li>
  );
};
