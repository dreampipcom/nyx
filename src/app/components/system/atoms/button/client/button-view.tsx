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
  theme: themes
}

interface VButtonProps {
  children: React.Component;
  variant : "solid" | "outline";
  theme   : "light" | "dark";
  onClick : (e: HTMLClickEvent) => void;
  icon: IButtonIcon
}

export const NVButton = ({ children, onClick, variant, theme, icon }: VButtonProps) => {
  /* remember server/client isomorphism */
  return <button onClick={onClick} className={styles.nexus__button}>{children}</button>;
};
