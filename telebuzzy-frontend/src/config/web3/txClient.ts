import {
  createPendingTxWatcher,
  createUseAppWriteContract,
  createUsePendingTxScope,
} from "@mydaogs/web3-client";
import { TxMessages, TxToastAdapter } from "@mydaogs/web3-tx";
import { createExplorerUrls } from "@mydaogs/web3";
import { createElement } from "react";
import { toast } from "@mydaogs/ui/client";
import { getAppChain } from "@/lib/utils";
import { txSyncStorage } from "./txSync";

/**
 * `@mydaogs/ui`'s `toast` adapter satisfying `TxToastAdapter`. `show` keys
 * the toast by tx hash so a pending -> reconciling update replaces the same
 * toast in place instead of stacking a new one.
 *
 * Kit's `ToastOptions.action` renders as a `ReactNode` (its own clickable
 * wrapper only handles dismiss-on-click bookkeeping), unlike sonner's native
 * `{ label, onClick }` action shape - build the action as an element here.
 */
const toastAdapter: TxToastAdapter = {
  show: ({ txHash, message, action }) => {
    toast(message, {
      id: txHash,
      action: action
        ? createElement(
            "button",
            {
              type: "button",
              className: "underline underline-offset-2",
              onClick: () =>
                window.open(action.url, "_blank", "noopener,noreferrer"),
            },
            action.label
          )
        : undefined,
    });
  },
  dismiss: (txHash) => {
    toast.dismiss(txHash);
  },
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
};

/**
 * English copy for the tx lifecycle. Defined once at module scope - this app
 * has no i18n layer, so the "hook" contract is satisfied by a function that
 * always returns the same reference rather than rebuilding an object every
 * render.
 */
const MESSAGES: TxMessages = {
  pending: (hashLabel) => `Transaction ${hashLabel} submitted`,
  confirmedUpdating: "Transaction confirmed, updating...",
  success: "Transaction confirmed!",
  refreshWarning:
    "Transaction confirmed, but refreshing the latest data failed. Reload the page to see the update.",
  reverted: "Transaction reverted",
  submissionError: "Transaction could not be submitted",
  executionError: "Transaction failed",
  unexpectedError: "Something went wrong",
  viewOnExplorer: "View on explorer",
};

const useMessages = (): TxMessages => MESSAGES;

const explorerUrls = createExplorerUrls(getAppChain());
const getExplorerTxUrl = (txHash: string) => explorerUrls.txUrl(txHash);

/**
 * This app has no auth-pause concept: server actions are keyed by an API
 * key stored on the user record, not a session that a 401 could invalidate.
 * `onAuthPaused` only ever runs after a `syncTxBeforeInvalidate` backend
 * replay is classified as a 401, and this app never supplies `syncTxHash`
 * (there is no backend replay of these writes), so this is unreachable in
 * practice. It is still required by `CreateUseAppWriteContractDeps` -
 * the log makes an otherwise-silent no-op observable if that ever changes.
 */
const onAuthPaused = () => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "onAuthPaused fired, but telebuzzy-frontend has no auth-pause concept and no syncTxHash configured"
    );
  }
};

const deps = {
  storage: txSyncStorage,
  toast: toastAdapter,
  useMessages,
  getExplorerTxUrl,
  onAuthPaused,
};

/** App-bound `useAppWriteContract`, see `@mydaogs/web3-client`. */
export const useAppWriteContract = createUseAppWriteContract(deps);

/** App-bound `usePendingTxScope`, see `@mydaogs/web3-client`. */
export const usePendingTxScope = createUsePendingTxScope(txSyncStorage);

/** App-bound `PendingTxWatcher`, mounted once in `Providers`. */
export const PendingTxWatcher = createPendingTxWatcher(deps);
