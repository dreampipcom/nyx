// @atoms/button-view.tsx
'use client';
import { Button } from "@mui/base/Button"
import { clsx } from "clsx"
import styles from "./button.module.css"
import { TpositionX, Tthemes, Tsize } from "@types"

interface IButtonIcon {
  position: TpositionX;
  size: Tsize;
  theme: Tthemes;
}

interface VButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  theme?: "light" | "dark";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IButtonIcon;
}

const classes = clsx({
  [styles.nexus__button]: true,
})

export const NVButton = ({ children, variant, theme, icon, ...regularHtmlProps }: VButtonProps) => {
  /* remember server/client isomorphism */
  return <Button className={classes} {...regularHtmlProps}>{children}</Button>;
};
