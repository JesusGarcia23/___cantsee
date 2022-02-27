import React, { useState } from "react";
import Link from "next/link";
import cn from "classnames";
import styles from "./Header.module.sass";
import Icon from "../Icon";
import Image from "../Image";
import Notification from "./Notification";
import User from "./User";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const nav = [
  {
    url: "/search01",
    title: "Discover",
  },
  {
    url: "/faq",
    title: "How it work",
  },
  {
    url: "/item",
    title: "Create item",
  },
  {
    url: "/profile",
    title: "Profile",
  },
];

const Headers = () => {
  const [visibleNav, setVisibleNav] = useState(false);
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    alert();
  };

  const connectWallter = async () => {
    console.log('CONNECT MARICA')
    const web3Modal = new Web3Modal()
    // web3Modal.clearCachedProvider();

    // setTimeout(() => {
    //   window.location.reload();
    // }, 1);
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    console.log('PROVIDER ', provider);    
    const signer = provider.getSigner();
    console.log('SIGNER ', signer);
  }

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link href="/">
          <div className={styles.logo}>
            <Image
              className={styles.pic}
              src="/images/logo-dark.png"
              srcDark="/images/logo-light.png"
              alt="Fitness Pro"
            />
          </div>
        </Link>
        <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>
          <nav className={styles.nav}>
            {nav.map((x, index) => (
              <Link href={x.url} key={index}>
                <button className={styles.link} activeClassName={styles.active}>
                  {x.title}
                </button>
              </Link>
            ))}
          </nav>
          <form
            className={styles.search}
            action=""
            onSubmit={() => handleSubmit()}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search"
              required
            />
            <button className={styles.result}>
              <Icon name="search" size="20" />
            </button>
          </form>
          <Link href="/upload-variants">
            <button className={cn("button-small", styles.button)}>Upload</button>
          </Link>
        </div>
        <Notification className={styles.notification} />
        <Link href="/upload-variants">
          <button className={cn("button-small", styles.button)}>
            Upload
          </button>
        </Link>
        <button className={cn("button-stroke button-small", styles.button)} onClick={() => connectWallter()}>
          Connect Wallet
        </button>
        {/* <User className={styles.user} /> */}
        <button
          className={cn(styles.burger, { [styles.active]: visibleNav })}
          onClick={() => setVisibleNav(!visibleNav)}
        ></button>
      </div>
    </header>
  );
};

export default Headers;
