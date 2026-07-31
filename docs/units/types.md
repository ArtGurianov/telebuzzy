# TypeScript types

## Locations

- Colocated with the component/module that uses them - non reusable
- `telebuzzies-frontend/src/lib/types.ts` - reusable within the app

## Units files lists (file path + one sentence short description)

### Non-Reusable

<!-- route-scoped or component-scoped types colocated with usage -->

### Reusable

`telebuzzies-frontend/src/lib/types.ts` carries the shared type helpers:

```ts
export type ValueOf<T extends object> = T[keyof T];

export type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;

export type NonUndefined<T> = T extends undefined ? never : T;
```

Plus product types: `FormStatus`, `InterceptQueryData`, `BillingPlan`, `EmailMessageType`
