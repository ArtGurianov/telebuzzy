import { Step } from "../Step";
import { ApiKeyControls } from "./ApiKeyControls";

export const InstructionsApiKey = () => {
  return (
    <Step
      id="get-started"
      index={1}
      title="Get your API key"
      description="Sign in with your email and generate a key. Store it as a secret and never commit it. Resetting issues a new key and the old one stops working."
    >
      <ApiKeyControls />
    </Step>
  );
};
