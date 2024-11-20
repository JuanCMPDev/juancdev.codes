import { HTMLAttributes } from "react";

type BoxProps = HTMLAttributes<HTMLDivElement>;

export function Box({ children, className, ...props }: BoxProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
