import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css"; // スタイルのインポート
import { ClipboardText, CalendarCheck, HouseLine } from "@phosphor-icons/react";


const Footer : React.FC = () => {

  return (
    <footer className={styles.footer}>
        <div className={styles.buttonback}>
            <Link href="/mobile-page" passHref>
                <button className={styles.footButton}>
                    <HouseLine  size={50} color="#4f2f2f" weight="duotone" className={styles.icons}/>
                    <div className={styles.text}>ほーむ</div>
                </button>  
            </Link>

            <Link href="/create-post/mobile-prifile" passHref>
                <button className={styles.footButton}>
                    <ClipboardText  size={50} color="#4f2f2f" weight="duotone" className={styles.icons}/>
                    <div className={styles.text}>ぷろふぃーる</div>
                </button>  
            </Link>

            <Link href="/create-post/mobile-carender" passHref>
                <button className={styles.footButton}>
                    <CalendarCheck  size={50} color="#4f2f2f" weight="duotone" className={styles.icons}/>
                    <div className={styles.text}>かれんだー</div>
                </button>  
            </Link>
        </div>
    </footer>
  );
};

export default Footer;