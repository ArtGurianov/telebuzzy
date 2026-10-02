# Form Rules

## Description

These rules define the default implementation pattern for forms

## When to use

- Creating a new user-input form
- Refactoring existing form code for consistency
- Reviewing form-related pull requests

## When NOT to use

- URL-driven filter controls where URL params are the source of truth and no submit mutation is performed
- Pure display components with no editable inputs

## Rules

- Use `react-hook-form` with `zodResolver` for client form state and validation
- Define or reuse a Zod schema from `telebuzzy-frontend/src/lib/schemas/*` and infer form types from that schema
- Use the shared form primitives from `telebuzzy-frontend/src/components/ui/form.tsx` (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) instead of custom ad-hoc wrappers
- Use the shared field components in `telebuzzy-frontend/src/components/ui/*` (`Input`, `Label`, etc.)
- Every editable control must have an associated label; never rely on placeholders alone
- Inside `FormField` `render={({ field }) => ...}`, prefer `<FormLabel>` for labelable controls and wrap the control with `<FormControl>` so id/aria wiring is automatic; avoid manual `htmlFor` and manual `id` unless a component requires it
- Use `<Label>` for non-`FormField` forms and for option labels that target explicit option ids
- For grouped controls (radio/checkbox sets), use `<fieldset>` + `<legend>` for the group label and keep per-option labels bound to their option ids
- Submit mutations through the server actions in `telebuzzy-frontend/src/app/actions/*` instead of client `fetch` from the form component
- Validate server-action form payloads with Zod (`safeParse`) before calling mutation functions
- Server component forms may use native `<form action={serverAction}>` for simple progressive-enhancement submit flows
- For onchain writes, keep local form state/validation with `react-hook-form` + Zod alongside the wagmi write hooks
- Do not wrap submit mutations in `startTransition(async () => ...)`; React transition pending does not guarantee tracking of async request completion
- Manage pending submission state with explicit async lifecycle (`useState` + `try/finally`, or an equivalent async hook state) and guard against re-entry while pending
- Use `FormMessage` for field-level validation errors and toast feedback (`sonner`) for submit result
- Reset transient submit state (error/success) when inputs change so feedback reflects the current attempt

## Examples

- Preferred submit flow
  - Define Zod schema in `src/lib/schemas`
  - Initialize `useForm` with `zodResolver(schema)`
  - Render controls through `FormField` + shared input components
  - Call a server action in `onSubmit`
  - Set `isSubmitting=true` before `await` and reset in `finally`
  - Ignore repeated submits while `isSubmitting` is `true`
