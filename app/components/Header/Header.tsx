import { useState } from "react";
import styles from "./Header.module.css"; // 必要なCSSを定義
import Image from "next/image";
import Link from "next/link";
//copmponents
import TextInputModal from '../Modal/TextInput_UI' ; 
import TextfromIMAGEModal from '../Modal/TextfromIMAGE_UI' ; 
import AuthModal from '../Modal/AuthModal';
import NicknameModal from '../Modal/Nickname'
import LogoutModal from '../Modal/LogoutModal';
import CalendarModal from '../Modal/CalenderModal'
import CardSports from '../Card/CardSports'
import CheerModal from '../Modal/CheerModal';
import ProfileModal from '../Modal/ProfileModal';


import logo from '../../public/logo2.png';
import sideBarImageOUT00 from '../../public/Sidever_imageOUT000.png';
import sideBarImage00 from '../../public/Sidever_image000.png';
import sideBarImage01 from '../../public/Sidever_image001a.png';
import sideBarImage02 from '../../public/Sidever_image002.png';
import sideBarImage03 from '../../public/Sidever_image003.png';
import sideBarImage04 from '../../public/Sidever_image004.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   // モーダル開閉制御
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isTextInputModalOpen, setIsTextInputModalOpen] = useState(false);
    const [isImageInputModalOpen, setIsImageInputModalOpen] = useState(false);
    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isCheerModalOpen, setIsCheerModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
          <button onClick={() => setIsLogoutModalOpen(true)}>
            
              <Image src={sideBarImageOUT00} alt="Open Modal" width={150} />

          </button>
        ) : (
          <button onClick={() => setIsSignUpModalOpen(true)}>
              <Image src={sideBarImage00}  alt="Open Modal" width={150} />
          </button>
        )}

        <button onClick={() => setIsTextInputModalOpen(true)} >
            <Image src={sideBarImage01} alt="Open Modal" width={150} />
        </button>

        <button onClick={() => setIsImageInputModalOpen(true)} >
            <Image src={sideBarImage02} alt="Open Modal" width={150} />
        </button>

        
        <button onClick={() => setIsCalendarModalOpen(true)} >
            <Image src={sideBarImage04} alt="Open Modal" width={150} />
        </button>

        <Link href="/create-post" passHref>
          <button>
              <Image src={sideBarImage03} alt="Go to Create Post" width={150} />
          </button>
        </Link>

        <Link href="/mobile-page" passHref>
          <button >
              <Image src={sideBarImage03} alt="Go to Create Post" width={150} />
          </button>
        </Link>   
        </div>
      )}
    </header>



      
  );
};

export default Header;
