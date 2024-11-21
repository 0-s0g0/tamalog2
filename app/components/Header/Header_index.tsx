import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css"; // スタイルのインポート
import local from "../../styles/local.module.css";
import { useState } from "react";

// 画像のインポート
import logo from '../../public/logo2.png';
import sideBarImageOUT00 from '../../public/Sidever_imageOUT000.png';
import sideBarImage00 from '../../public/Sidever_image000.png';
import sideBarImage01 from '../../public/Sidever_image001a.png';
import sideBarImage02 from '../../public/Sidever_image002.png';
import sideBarImage03 from '../../public/Sidever_image003.png';
import sideBarImage04 from '../../public/Sidever_image004.png';

interface HeaderINDEXProps {
  isLoggedIn: boolean;
  setIsLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTextInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsImageInputModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCalendarModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderINDEX: React.FC<HeaderINDEXProps> = ({

  isLoggedIn,
  setIsLogoutModalOpen,
  setIsSignUpModalOpen,
  setIsTextInputModalOpen,
  setIsImageInputModalOpen,
  setIsCalendarModalOpen,
}) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src={logo} alt="Logo" width={100} height={50} />
      </div>
        <div
            className={`${styles.menuButton} ${isMenuOpen ? styles.closeButton : ""}`}
            onClick={toggleMenu}
            aria-label="Menu"
        >
            <span />
            <span />
            <span />
        </div>

      {isMenuOpen && (
        <div className={styles.menu}>
        {isLoggedIn ? (
            <button onClick={() => setIsLogoutModalOpen(true)} >
                <Image src={sideBarImageOUT00} alt="Logout" width={150} />
            </button>
        ) : (
            <button onClick={() => setIsSignUpModalOpen(true)} >
                <Image src={sideBarImage00} alt="Sign Up" width={150} />
            </button>
        )}

        <button onClick={() => setIsTextInputModalOpen(true)} >
            <Image src={sideBarImage01} alt="Text Input Modal" width={150} />
        </button>

        <button onClick={() => setIsImageInputModalOpen(true)} >
            <Image src={sideBarImage02} alt="Image Input Modal" width={150} />
        </button>

        <button onClick={() => setIsCalendarModalOpen(true)} >
            <Image src={sideBarImage04} alt="Calendar Modal" width={150} />
        </button>

        <Link href="/create-post" passHref>
            <button>
                <Image src={sideBarImage03} alt="Create Post" width={150} />
            </button>
        </Link>

        <Link href="/mobile-page" passHref>
            <button >
                <Image src={sideBarImage03} alt="Mobile Page" width={150} />
            </button>
        </Link>
        </div>
        )}
    </header>
  );
};

export default HeaderINDEX;