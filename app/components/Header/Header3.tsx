import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header3.module.css"; // スタイルのインポート
import local from "../../styles/local.module.css";
import { useState } from "react";
import { UserCircle, KeyReturn, Keyboard, TrayArrowUp, Footprints, ClipboardText, DeviceMobileCamera, CalendarCheck } from "@phosphor-icons/react";
import Input from "postcss/lib/input";
// 画像のインポート
import logo from '../../public/logo2.png';
import InputModal from "../Modal/InputModal";
import LogoutModal from "../Modal/LogoutModal";
import TextInputModal from "../Modal/TextInput_UI";
import ImageInputModal from "../Modal/ImageInputModal";
import { setMaxListeners } from "events";


export default function Header3() {


  return (
    <header className={styles.header}>
        <div className={styles.logo}>
          <Image src={logo} alt="Logo" width={100} height={50} />
        </div>
        <div className={styles.Buttonleft}>

         <Link href="/mobile-page" passHref>
                <KeyReturn size={40} color="#4f2f2f" weight="fill" className={styles.icons}/>
                <div className={styles.text}>もどる</div>
         </Link>
      </div>


        

    </header>
  );
};