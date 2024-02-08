// @atoms/button-view.tsx
'use client';
import { Input } from "@mui/base/input"
import { debounce } from "@helpers"
import { clsx } from "clsx"
import styles from "./input.module.css"

interface IInputIcon {
  position: TpositionX;
  size: TpositionX;
  theme: Tthemes;
}

interface VInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "solid" | "outline";
  theme?: "light" | "dark";
  onChange?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IInputIcon;
}

export const NVInput = ({ children, onChange, value, ...regularHtmlProps }: VInputProps) => {
  const handleChange = (e) => {
    setValue()
    if(onChange) {
      onChange(e.target.value)
    }
  }
  const dbHandleChange = (e) => {
    debounce(handleChange, 500)
  }


  const classes = clsx({
    [styles.nexus__input]: regularHtmlProps.type !== "hidden",
  })
  /* remember server/client isomorphism */
  return <Input className={classes} {...regularHtmlProps} onChange={dbHandleChange} >{children}</Input>;
};
