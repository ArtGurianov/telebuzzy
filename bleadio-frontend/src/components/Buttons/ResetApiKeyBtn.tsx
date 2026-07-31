import { withAuthBtn } from "@/components/Login/withAuthBtn";
import { Button } from "@/components/ui/button";
import { GetComponentProps } from "@/lib/types";

interface ResetApiKeyBtnProps extends GetComponentProps<typeof Button> {
  userEmail: string | null;
}

const ResetApiKeyBtnCore = ({
  children,
  disabled,
  onClick,
}: ResetApiKeyBtnProps) => {
  return (
    <Button disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
};

const ResetApiKeyBtn = withAuthBtn(ResetApiKeyBtnCore);
ResetApiKeyBtn.displayName = "ResetApiKeyBtn";

export { ResetApiKeyBtn };
