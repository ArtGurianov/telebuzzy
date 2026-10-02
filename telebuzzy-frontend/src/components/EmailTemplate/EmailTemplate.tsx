import { EmailMessageType } from "@/lib/types";
import { EmailTemplateData } from "./constants";

export const EmailTemplate = ({ type }: { type: EmailMessageType }) => {
  const { title, description } = EmailTemplateData[type];

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};
