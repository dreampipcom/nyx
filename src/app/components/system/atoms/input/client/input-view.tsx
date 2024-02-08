// @atoms/button-view.tsx
'use client';
import type { TpositionX, Tthemes } from "@types"
import { useInput } from '@mui/base/useInput';
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
  onChange?: (value: any) => any;
  icon?: IInputIcon;
}

export const NVInput = ({ children, onChange, value, ...regularHtmlProps }: VInputProps) => {
  const { getRootProps }  = useInput()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(onChange) {
      onChange(e.target.value)
    }
  }
  const dbHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounce(handleChange, 500)
  }


  const classes = clsx({
    [styles.nexus__input]: regularHtmlProps.type !== "hidden",
  })
  /* remember server/client isomorphism */
  return <input className={classes} {...getRootProps()} {...regularHtmlProps} onChange={dbHandleChange} >{children}</input>;
};
