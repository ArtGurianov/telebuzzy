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
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { emailSchema } from "@/lib/schemas/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/actions/login";
import { useRouter } from "next/navigation";

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

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const [formStatus, setFormStatus] = useState<FormStatus>("PENDING");

  const handleSubmit = ({ email }: { email: string }) => {
    setFormStatus("LOADING");
    login(email)
      .catch((error) => {
        if (error?.message !== "NEXT_REDIRECT") {
          setFormStatus("ERROR");
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
      onClose={() => {
        setIsOpen(false);
        router.push("/", { scroll: false });
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col sm:flex-row gap-4 self-stretch justify-center items-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grow self-stretch">
                <FormLabel htmlFor={field.name}>{"Email"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={formStatus === "LOADING"}
                    placeholder={"Enter your email"}
                    onChange={(ev) => {
                      setFormStatus("PENDING");
                      form.clearErrors();
                      field.onChange(ev);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-center text-danger" />
              </FormItem>
            )}
          />
          <div className="flex self-end justify-end">
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
