# TypeScript types

## Locations

- Colocated with the component/module that uses them - non reusable
- `telebuzzy-frontend/src/lib/types.ts` - reusable within the app

## Units files lists (file path + one sentence short description)

### Non-Reusable

<!-- route-scoped or component-scoped types colocated with usage -->

### Reusable

`telebuzzy-frontend/src/lib/types.ts` carries the shared type helpers:

```ts
export type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;

export type NonUndefined<T> = T extends undefined ? never : T;
```

`ValueOf<T extends object> = T[keyof T]` is sourced from `@mydaogs/core` rather than defined locally

Plus product types: `FormStatus`, `InterceptQueryData`, `BillingPlan`, `EmailMessageType`
