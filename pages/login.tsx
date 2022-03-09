import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";
import useRouterEvent from "../hooks/router-event";
import { magic } from "../lib/magic-client";

import classes from "../styles/Login.module.css";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onRouteComplete = useCallback(() => {
    setIsLoading(false);
  }, []);
  useRouterEvent(onRouteComplete);

  const loginHandler = async () => {
    setErrorMessage("");
    const emailInputElem = emailRef.current;
    if (emailInputElem) {
      if (emailInputElem.value === "" || !emailInputElem.value.includes("@")) {
        setErrorMessage("Invalid email detected");
      } else {
        // log in a user by their email
        setIsLoading(true);
        try {
          if (magic) {
            const didToken = await magic.auth.loginWithMagicLink({
              email: emailInputElem.value,
            });

            if (didToken) {
              const response = await axios({
                url: "/api/login",
                method: "POST",
                headers: {
                  Authorization: "Bearer " + didToken,
                  "Content-Type": "application/json",
                },
              });
              const data = response.data;
              if (data.success) {
                router.push("/");
              } else {
                setIsLoading(false);
                setErrorMessage("Failed to login");
              }
            } else {
              throw new Error("DIDToken not found");
            }
          } else {
            throw new Error("Magic Link API Error");
          }
        } catch (err) {
          // Handle errors if required!
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className={classes.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.headerWrapper}>
          <Link href='/'>
            <a className={classes.logoLink}>
              <div className={classes.logoWrapper}>
                <Image
                  src='/static/netflix-icon.svg'
                  alt='Netflix logo'
                  width='128px'
                  height='34px'
                />
              </div>
            </a>
          </Link>
        </div>
      </header>
      <main className={classes.main}>
        <div className={classes.mainWrapper}>
          <h1 className={classes.signinHeader}>Sign In</h1>
          <input
            type='text'
            placeholder='Email address'
            className={classes.emailInput}
            ref={emailRef}
          />
          {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
          <button onClick={loginHandler} className={classes.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
