# React components

## Locations

- Colocated with the route/component that uses them - non reusable
- `telebuzzy-frontend/src/components/` - reusable within the app, re-exported via `index.ts` where a barrel exists

## Units files lists (file path + one sentence short description)

### Non-Reusable

<!-- route-scoped components colocated with usage -->

### Reusable

#### Kit (`@mydaogs/ui`)

- `Button`, from `@mydaogs/ui` - the app's button primitive; every local button wrapper (`Buttons/*`, `Login/withAuthBtn.tsx`) renders it
- `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogDescription`, from `@mydaogs/ui/client` - raw dialog primitives, used directly by `Billing/BillingDialog.tsx`
- `Drawer`/`DrawerContent`/`DrawerHeader`/`DrawerTitle`/`DrawerDescription`/`DrawerTrigger`, from `@mydaogs/ui/client` - raw drawer primitives, used directly by `common/PopoverDrawer/PopoverDrawer.tsx`
- `Popover`/`PopoverContent`/`PopoverTrigger`, from `@mydaogs/ui/client` - raw popover primitives, used directly by `common/PopoverDrawer/PopoverDrawer.tsx`
- `Input`, from `@mydaogs/ui/client` - text input, used by `Login/LoginDialog.tsx`'s email form
- `Toaster`/`toast`, from `@mydaogs/ui/client` - toast host mounted in `src/app/layout.tsx`; `toast` is used by `config/web3/txClient.ts`'s tx lifecycle adapter
- `TooltipPopover`, from `@mydaogs/ui/client` - tooltip above the `sm` breakpoint, popover below it, switching internally. Used by `common/InlineInfo/InlineInfo.tsx` and `WalletInfo/WalletInfoConnected.tsx`
- `TruncatedString`, from `@mydaogs/ui/client` - truncates a long string and shows the full value in a `TooltipPopover` on demand. Used by `WalletInfo/WalletInfoConnected.tsx` for the connected wallet address
- `CopyToClipboardBtn`, from `@mydaogs/ui/client` - copy-to-clipboard icon button. Used by `Instructions/Usage/InstructionsUsage.tsx` and `Instructions/ApiKey/ApiKeyControls.tsx`
- `DialogDrawer`, from `@mydaogs/ui/client` - dialog above the `sm` breakpoint, drawer below it, registered with the single `DialogShellHost`. Wrapped locally by `common/DialogDrawer/DialogDrawer.tsx`
- `DialogShellProvider`, from `@mydaogs/ui/client` - mounts the single dialog/drawer stack host; mounted once in `Providers/Providers.tsx` around every route
- `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage`, from `@mydaogs/ui/form` - react-hook-form bindings, used by `Login/LoginDialog.tsx`'s email form

#### App

- `telebuzzy-frontend/src/components/Billing/BillingDialog.tsx` - PRO plan dialog showing pricing, wallet info, and the approve/spend buttons for both billing periods
- `telebuzzy-frontend/src/components/Billing/ButtonsBlock.tsx` - one billing-period card (price, approve button, spend button) inside `BillingDialog`
- `telebuzzy-frontend/src/components/Buttons/ApproveTransactionBtn.tsx` - approves ERC-20 spending for the subscription price, built on `useAppWriteContract`
- `telebuzzy-frontend/src/components/Buttons/ConnectWalletBtn.tsx` - connects MetaMask via the headless wagmi connector
- `telebuzzy-frontend/src/components/Buttons/DisconnectWalletBtn.tsx` - disconnects the connected wallet
- `telebuzzy-frontend/src/components/Buttons/LogoutBtn.tsx` - signs the user out via next-auth
- `telebuzzy-frontend/src/components/Buttons/ResetApiKeyBtn.tsx` - resets/generates the user's API key
- `telebuzzy-frontend/src/components/Buttons/SpendTransactionBtn.tsx` - calls `updateSubscription` on the contract, built on `useAppWriteContract`
- `telebuzzy-frontend/src/components/Buttons/UserProfileBtn.tsx` - trigger button that opens the user profile `PopoverDrawer`
- `telebuzzy-frontend/src/components/common/AnyFragment/AnyFragment.tsx` - generic `Fragment` wrapper that forwards a `key` prop, for mapping over components that require one
- `telebuzzy-frontend/src/components/common/DialogDrawer/DialogDrawer.tsx` - thin wrapper around kit's `DialogDrawer` adding the app's styled content box
- `telebuzzy-frontend/src/components/common/DialogDrawer/PageInterceptor.tsx` - opens a `DialogDrawer` on mount and calls `router.back()` on close, for a route-level intercepted page
- `telebuzzy-frontend/src/components/common/DialogDrawer/QueryInterceptor.tsx` - opens a `DialogDrawer` when a configured query param is present, and strips it from the URL on close
- `telebuzzy-frontend/src/components/common/InlineInfo/InlineInfo.tsx` - labeled inline value box with an optional `TooltipPopover` info icon
- `telebuzzy-frontend/src/components/common/PopoverDrawer/PopoverDrawer.tsx` - popover above the `sm` breakpoint, drawer below it, switching via `useBreakpoint`
- `telebuzzy-frontend/src/components/EmailTemplate/EmailTemplate.tsx` - renders the title/description for a given `EmailMessageType`, used by Resend emails
- `telebuzzy-frontend/src/components/ExampleApi/ExampleApi.tsx` - static example-usage screenshot on the landing page
- `telebuzzy-frontend/src/components/Footer/Footer.tsx` - site footer with contact link and ecosystem credit
- `telebuzzy-frontend/src/components/Hero/Hero.tsx` - landing page hero banner
- `telebuzzy-frontend/src/components/Instructions/ApiKey/ApiKeyControls.tsx` - displays and copies the user's API key, with reset control
- `telebuzzy-frontend/src/components/Instructions/ApiKey/InstructionsApiKey.tsx` - step 1 instructions card wrapping `ApiKeyControls` in an `InlineInfo`
- `telebuzzy-frontend/src/components/Instructions/Instructions.tsx` - the 3-step onboarding list (API key, Telegram bot, usage)
- `telebuzzy-frontend/src/components/Instructions/TelegramBot/InstructionsTelegramBot.tsx` - step 2 instructions linking to the Telegram bot
- `telebuzzy-frontend/src/components/Instructions/Usage/InstructionsUsage.tsx` - step 3 instructions with copyable `curl`/language code samples
- `telebuzzy-frontend/src/components/Login/LoginDialog.tsx` - email magic-link login form inside a `DialogDrawer`, opened via the `open-login-dialog` custom event
- `telebuzzy-frontend/src/components/Login/withAuthBtn.tsx` - HOC that swaps an authenticated action button for one that fires `open-login-dialog` when signed out
- `telebuzzy-frontend/src/components/MyDaogsPromo/MyDaogsPromo.tsx` - promo banner linking to the MyDAOgs ecosystem site
- `telebuzzy-frontend/src/components/Motto/Motto.tsx` - landing page tagline block
- `telebuzzy-frontend/src/components/Providers/Providers.tsx` - mounts `SessionProvider`, `WagmiProvider`, `QueryClientProvider`, `SubscriptionProvider`, `DialogShellProvider`, and `PendingTxWatcher`
- `telebuzzy-frontend/src/components/Providers/SubscriptionProvider.tsx` - `useSubscription` context reading the connected user's on-chain subscription
- `telebuzzy-frontend/src/components/UpgradeBanner/UpgradeBanner.tsx` - dismissible bottom banner prompting a LIGHT-plan user to upgrade
- `telebuzzy-frontend/src/components/WalletInfo/WalletInfo.tsx` - switches between `WalletInfoConnected`/`WalletInfoNotConnected` based on wagmi's `isConnected`
- `telebuzzy-frontend/src/components/WalletInfo/WalletInfoConnected.tsx` - shows the connected address (`TruncatedString`) and USD token balance
- `telebuzzy-frontend/src/components/WalletInfo/WalletInfoNotConnected.tsx` - prompts wallet connection with a link to install MetaMask
