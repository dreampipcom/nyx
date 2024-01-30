import { useEffect, useState } from "react";

export function useAsync(call, initial) {
  const [result, setResult] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function asyncCall() {
      try {
        setLoading(true);
        const res = await call()
        setResult(
          res
        );
      } catch (error) {
        setLoading(undefined);
      }
    }

    if (!!call) {
      asyncCall()
    }
  }, [call]);

  return [result, loading];
}