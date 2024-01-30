import { debounce } from "lodash";
import { useEffect, useState } from "react";

export function useFirstInteraction(call, triggers, attachOn, removeOn) {
  const [count, setCount] = useState(0);

  const mouseHandler = () => {
    call()
    setCount(count+1)
  }

  useEffect(() => {
    const shouldAttach = attachOn?.length && removeOn?.length && attachOn.every((rule) => !!rule) && !removeOn.some((rule) => !!rule)
    const shouldRemove = attachOn?.length && removeOn?.length && removeOn.every((rule) => !!rule) && !attachOn.some((rule) => !!rule)
    if (shouldAttach) {
      document.documentElement.addEventListener("mouseover", mouseHandler)
      document.documentElement.addEventListener("touchstart", mouseHandler)
    }
    if (shouldRemove) {
      //mouseHandler.cancel()
      document.documentElement.removeEventListener("mouseover", mouseHandler)
      document.documentElement.removeEventListener("touchstart", mouseHandler)
    }

    return () => {
      document.documentElement.removeEventListener("mouseover", mouseHandler)
      document.documentElement.removeEventListener("touchstart", mouseHandler)
    }
  }, [call, attachOn, removeOn, triggers]);

  return [count];
}