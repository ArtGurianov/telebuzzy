import { ReactNode } from "react";
import { BILLING_PLANS, EMAIL_MESSAGE_TYPES } from "./utils/contsants";

export type ValueOf<T extends object> = T[keyof T];
export type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;

export type FormStatus = "PENDING" | "LOADING" | "ERROR" | "SUCCESS";

export interface InterceptQueryData {
  queryKey: string;
  title: string;
  children: ReactNode;
}

export type NonUndefined<T> = T extends undefined ? never : T;

export type BillingPlan = ValueOf<typeof BILLING_PLANS>;

export type EmailMessageType = ValueOf<typeof EMAIL_MESSAGE_TYPES>;
