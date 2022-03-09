import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { magic } from "../../lib/magic-client";

import classes from "./navbar.module.css";

const NavBar: React.FC = () => {
  const router = useRouter();

  const [didToken, setDidToken] = useState("");

  // routes for navigation links
  const homeLinkHandler = () => {
    router.push("/");
  };
  const myListLinkHandler = () => {
    router.push("/browse/my-list");
  };

  // state to manage if sign out link is visible
  const [dropDownIsVisible, setDropDownIsVisible] = useState(false);

  // Fetches the username of the currently logged in user
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    const getUserEmail = async () => {
      if (!magic) return;
      try {
        const { email } = await magic.user.getMetadata();
        const DIDToken = await magic.user.getIdToken();
        if (email) {
          setUsername(email);
          setDidToken(DIDToken);
        }
      } catch (err: any) {
        console.error("Error Retrieving email", err.message);
      }
    };
    getUserEmail();
    return () => {};
  }, []);

  // Signs user out of the website
  const signOutHandler = async () => {
    if (!magic) return;
    try {
      await axios({
        url: "/api/logout",
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
        },
      });
    } catch (err: any) {
      console.error("Error Signing out", err.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Link href='/'>
          <a className={classes.logoLink}>
            <div className={classes.logoWrapper}>
              <Image
                src='/static/netflix-icon.svg'
                alt='Netflix icon'
                width='128px'
                height='34px'
              />
            </div>
          </a>
        </Link>

        <ul className={classes.navItems}>
          <li className={classes.navItem} onClick={homeLinkHandler}>
            Home
          </li>
          <li className={classes.navItem2} onClick={myListLinkHandler}>
            My List
          </li>
        </ul>
        <nav className={classes.navContainer}>
          <div>
            <button
              className={classes.usernameBtn}
              onClick={() => setDropDownIsVisible((curr) => !curr)}>
              <p className={classes.username}>{username}</p>
              <Image
                src='/static/expand-arrow_icon.svg'
                alt='expand more icon'
                width='24px'
                height='24px'
              />
            </button>
            {dropDownIsVisible && (
              <div className={classes.navDropdown}>
                <Link href='/login'>
                  <a className={classes.linkName} onClick={signOutHandler}>
                    Sign out
                  </a>
                </Link>
                <div className={classes.lineWrapper}></div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
