import { useRouter } from "next/router";
import { useEffect } from "react";

const useRouterEvent = (action: () => void) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => action();

    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeError", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChange);
    };
  }, [router, action]);
};

export default useRouterEvent;
