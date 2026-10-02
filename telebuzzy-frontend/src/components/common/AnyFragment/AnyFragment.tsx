import { Fragment, Key, ReactNode } from "react";

export const AnyFragment = <
  T extends object & { key?: Key | null; children?: ReactNode | null },
>(
  props: T
) => {
  return (
    <Fragment {...(props.key ? { key: props.key } : {})}>
      {props.children}
    </Fragment>
  );
};
