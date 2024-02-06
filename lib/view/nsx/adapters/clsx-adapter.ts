// clsx-adapter.ts
// * clsx nsx adapter *
// all adapters/decorators/facaders should receive all props and return all props

import { clsx } from 'clsx';

export default function clsxAdapter(props) {
  if (!props?.sx) return props;

  /* 
    sx prop is transformed into (sx props classnames strings.
  */
  const customClasses = props.classNames;

  const classes = {
    custom: customClasses,
    sx: undefined,
    final: customClasses,
  };

  /* 
    sx prop to clsx:
    sx takes an object
    object has css module classname strings and booleans key-pair values
    sx prop is transformed into (sx props classnames strings + extra custom classNames).
  */
  const sxClasses = ' ' + clsx(props.sx);
  classes.sx = sxClasses;

  classes.final = classes.custom + sxClasses;
  props.classNames = classes.final;

  return props;
}
