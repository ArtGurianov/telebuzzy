"use client";

import { DialogDrawer } from "@/components/common/DialogDrawer/DialogDrawer";
import { FormStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
      title={"Please login to continue."}
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
              <span className="text-2xl text-center text-primary">
                {"Email sent!"}
              </span>
            ) : (
              <Button
                type="submit"
                disabled={
                  formStatus === "LOADING" ||
                  !!Object.keys(form.formState.errors).length
                }
              >
                {formStatus === "LOADING" ? "Loading..." : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </DialogDrawer>
  );
};
