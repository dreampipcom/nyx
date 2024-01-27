// @atoms/button-view.tsx
"use client";
//import styles from "./button.module.css"

interface VButtonProps {
}

export const NVButton = ({}: VButtonProps) => {
  /* remember server/client isomorphism */
	console.log("render button")
	return (
	  <button className={styles.nexus__button}>
	    I'm a button.
	  </button>
	);
}
