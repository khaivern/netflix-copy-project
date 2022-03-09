import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { magic } from "../lib/magic-client";
import useRouterEvent from "../hooks/router-event";
import Loading from "../components/loading/loading";

function MyApp({ Component, pageProps }: AppProps) {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // set to true

  // useEffect(() => {
  //   const checkUserIsLoggedIn = async () => {
  //     try {
  //       if (magic) {
  //         const isLoggedIn = await magic.user.isLoggedIn();
  //         if (isLoggedIn) {
  //           router.push("/");
  //         } else {
  //           throw new Error("Not Logged In");
  //         }
  //       }
  //     } catch (err) {
  //       router.push("/login");
  //     }
  //   };
  //   // checkUserIsLoggedIn();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onRouteComplete = useCallback(() => {
    setIsLoading(false);
  }, []);
  useRouterEvent(onRouteComplete);

  if (isLoading) {
    return <Loading />;
  }

  return <Component {...pageProps} />;
}

export default MyApp;
