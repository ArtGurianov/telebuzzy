# [ARCH] - React Hook Form Integration

## Description

Forms use react-hook-form with `zodResolver` for type-safe validation and shared UI form components

## Behavior

- Schemas live in `src/lib/schemas`
- Forms submit to server actions and show toast feedback (`sonner`)
- Pending state is tracked with an explicit async lifecycle, not `useTransition` — a React transition's pending flag does not reliably track async request completion

## Related files

- `telebuzzies-frontend/src/components/ui/form.tsx`
- `telebuzzies-frontend/src/lib/schemas/`
- `rules/forms-rules.md`
