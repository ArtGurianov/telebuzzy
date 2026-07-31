import { AppClientError } from "./appClientError";

export const formatErrorMessage = (error?: any) => {
  const isClientError = error instanceof AppClientError;
  if (!isClientError) {
    try {
      console.error(error.message);
    } catch {
      console.error("A server error of unexpected format has occured.");
    }
  }
  return isClientError ? error.message : "A server error has occured.";
};
