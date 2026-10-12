"use client";

import { DialogDrawer } from "@/components/common/DialogDrawer/DialogDrawer";
import { FormStatus } from "@/lib/types";
import { Button } from "@mydaogs/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mydaogs/ui/form";
import { Input } from "@mydaogs/ui/client";
import { FC, useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { getClientConfig } from "@/config/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/actions/login";
import { useRouter } from "next/navigation";

const ENV_CONFIG = getClientConfig();

export const LoginDialog: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    document.addEventListener("open-login-dialog", handleOpen);
    return () => {
      document.removeEventListener("open-login-dialog", handleOpen);
    };
  }, []);

  const captchaRef = useRef<HCaptcha>(null);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      captchaToken: "",
    },
  });
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const captchaToken = form.watch("captchaToken");

  // hCaptcha tokens are single-use: every attempt needs a fresh solve
  const resetCaptcha = () => {
    captchaRef.current?.resetCaptcha();
    form.setValue("captchaToken", "");
  };

  const handleSubmit = (data: z.infer<typeof loginSchema>) => {
    if (formStatus === "LOADING") return;
    setFormStatus("LOADING");
    setSubmitError(null);
    login(data)
      .then((res) => {
        if (res && !res.success) {
          setSubmitError(res.errorMessage);
          setFormStatus("ERROR");
          resetCaptcha();
        }
      })
      .catch((error) => {
        if (error?.message !== "NEXT_REDIRECT") {
          setSubmitError("Something went wrong. Please try again");
          setFormStatus("ERROR");
          resetCaptcha();
        }
      })
      .finally(() => {
        setFormStatus((prev) => (prev === "LOADING" ? "SUCCESS" : prev));
      });
  };

  return (
    <DialogDrawer
      title={"Sign in to Telebuzzy"}
      isOpen={isOpen}
      // hCaptcha mounts its challenge popup on <body>, outside the dialog:
      // focusing or clicking it must not count as an outside interaction
      preventDialogOutsideInteraction
      onClose={() => {
        setIsOpen(false);
        router.push("/", { scroll: false });
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col items-stretch gap-4 self-stretch"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grow self-stretch">
                <FormLabel>{"Email"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={formStatus === "LOADING"}
                    placeholder={"Enter your email"}
                    onChange={(ev) => {
                      setFormStatus("PENDING");
                      setSubmitError(null);
                      form.clearErrors("email");
                      field.onChange(ev);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-center text-danger" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="captchaToken"
            render={() => (
              <FormItem className="items-center">
                <div className="flex min-h-[78px] justify-center">
                  <HCaptcha
                    ref={captchaRef}
                    sitekey={ENV_CONFIG.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                    theme="light"
                    onVerify={(token) => {
                      setSubmitError(null);
                      form.setValue("captchaToken", token, {
                        shouldValidate: true,
                      });
                    }}
                    onExpire={() => {
                      form.setValue("captchaToken", "");
                    }}
                    onError={() => {
                      form.setValue("captchaToken", "");
                    }}
                  />
                </div>
                <FormMessage className="text-center text-danger" />
              </FormItem>
            )}
          />
          {submitError ? (
            <p role="alert" className="text-center text-sm text-tb-danger">
              {submitError}
            </p>
          ) : null}
          <div className="flex justify-center">
            {formStatus === "SUCCESS" ? (
              <span
                role="status"
                className="text-center font-semibold text-tb-success"
              >
                {"Check your inbox for the magic link"}
              </span>
            ) : (
              <Button
                type="submit"
                className="tb-pressable h-11 rounded-full px-6 text-base font-semibold"
                disabled={
                  formStatus === "LOADING" ||
                  !captchaToken ||
                  !!Object.keys(form.formState.errors).length
                }
              >
                {formStatus === "LOADING" ? "Sending…" : "Email me a link"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </DialogDrawer>
  );
};
