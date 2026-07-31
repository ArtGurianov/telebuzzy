import { NonUndefined } from "../types";
import { formatErrorMessage } from "./formatErrorMessage";

export interface CreateActionResponseProps {
  data?: any;
  error?: any;
}

export interface ActionResponse {
  success: boolean;
  data: NonUndefined<any>;
  errorMessage: string | null;
}

export const createActionResponse = ({
  data,
  error,
}: CreateActionResponseProps): ActionResponse => {
  return {
    success: !error,
    data: typeof data === "undefined" ? null : data,
    errorMessage: error ? formatErrorMessage(error) : null,
  };
};
