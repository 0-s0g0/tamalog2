import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header3.module.css"; // スタイルのインポート

import { KeyReturn, PencilSimple } from "@phosphor-icons/react";
import CalendarModal from "../Modal/CalenderModal";
import { EntrySports } from "../type";

// 画像のインポート
import logo from '../../public/logo2.png';



export default function Header4() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sportsEntries, setSportsEntries] = useState<EntrySports[]>([]);

  return (
    <>
    <header className={styles.header}>
        <div className={styles.logo}>
          <Image src={logo} alt="Logo" width={100} height={50} />
        </div>
        <div className={styles.Buttonleft}>

        <button onClick={() => setIsModalOpen(true)}  className={styles.HeadButton}>
                <PencilSimple size={40} color="#4f2f2f" weight="fill" className={styles.icons}/>
        <div className={styles.text}>にゅうりょく</div>
         </button>

         <Link href="/mobile-page" passHref>
                <KeyReturn size={40} color="#4f2f2f" weight="fill" className={styles.icons}/>
                <div className={styles.text}>もどる</div>
         </Link>
      </div>


        

    </header>
    <CalendarModal 
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      setSportsEntries={setSportsEntries}
    />
    </>
  );
};