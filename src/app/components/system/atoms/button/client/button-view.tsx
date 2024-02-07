// @atoms/button-view.tsx
'use client';
import styles from "./button.module.css"

type positionCenter = "center"
type positionX = "left" | "right"
type positionY = "top" | "bottom"
type themes = "light" | "dark"

type position = positionCenter | positionX | positionY

interface IButtonIcon {
  position: "left" | "right";
  size: positionX;
  theme: themes;
}

interface VButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  theme?: "light" | "dark";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IButtonIcon;
}

export const NVButton = ({ children, onClick, variant, theme, icon, ...regularHtmlProps }: VButtonProps) => {
  /* remember server/client isomorphism */
  return <button {...regularHtmlProps} onClick={onClick} className={styles.nexus__button}>{children}</button>;
};
