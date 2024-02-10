// @atoms/button-view.tsx
'use client';
import { clsx } from "clsx"
import styles from "./divider.module.css"

interface VDividerProps extends React.HTMLProps<HTMLHRElement> {
}

export const NVDivider = ({ children, ...regularHtmlProps }: VDividerProps) => {
  const classes = clsx({
    [styles.nexus__divider]: regularHtmlProps.type !== "hidden",
  })
  /* remember server/client isomorphism */
  return <hr className={classes} {...regularHtmlProps} />;
};
