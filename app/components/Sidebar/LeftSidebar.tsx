import React, { FC } from 'react';
import Image from 'next/image'; // if you're using Next.js Image component
import CountDisplay from '../Countdisplay'; // replace with actual import path
import stylesSidever from './LeftSidever.module.css'

type LeftSidebarProps = {
  isLoggedIn: boolean;
  setIsLogoutModalOpen: () => void;
  setIsSignUpModalOpen: () => void;
  setIsTextInputModalOpen: () => void;
  setIsImageInputModalOpen: () => void;
  setIsNicknameModalOpen: () => void;
  setIsCalendarModalOpen: () => void;
  entries: any[]; // replace with specific type if available
  stylesSidever: any; // replace `any` with a specific type if applicable (e.g., CSSModule)
  images: {
    logo: string;
    icon01: string;
    sideBarImage00: string;
    sideBarImage01: string;
    sideBarImage02: string;
    sideBarImage03: string;
    sideBarImage04: string;
  };
};

const LeftSidebar: FC<LeftSidebarProps> = ({
  isLoggedIn,
  setIsLogoutModalOpen,
  setIsSignUpModalOpen,
  setIsTextInputModalOpen,
  setIsImageInputModalOpen,
  setIsNicknameModalOpen,
  setIsCalendarModalOpen,
  entries,
  stylesSidever,
  images,
}) => {
  return (
    <aside className={stylesSidever.sidebar}>
      <Image src={images.logo} alt="Open Modal" width={200} />
      {isLoggedIn ? (
        <button onClick={setIsLogoutModalOpen} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={images.icon01} alt="Open Modal" width={50} height={50} />
          </div>
        </button>
     ) : (
        <button onClick={() => setIsSignUpModalOpen()} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image
              src={images.sideBarImage00}
              alt="Open Modal"
              width={150} // 画像の幅を設定
              height={50} // 画像の高さを設定
            />
          </div>
        </button>
      )}

      <button onClick={() => setIsTextInputModalOpen()} className={stylesSidever.sidebarButton}>
        <div className={stylesSidever.buttonContent}>
          <Image
            src={images.sideBarImage01}
            alt="Open Modal"
            width={150}
            height={50}
          />
        </div>
      </button>

      <button onClick={() => setIsImageInputModalOpen()} className={stylesSidever.sidebarButton}>
        <div className={stylesSidever.buttonContent}>
          <Image
            src={images.sideBarImage02}
            alt="Open Modal"
            width={150}
            height={50}
          />
        </div>
      </button>

      <button onClick={() => setIsNicknameModalOpen()} className={stylesSidever.sidebarButton}>
        <div className={stylesSidever.buttonContent}>
          <Image
            src={images.sideBarImage03}
            alt="Open Modal"
            width={150}
            height={50}
          />
        </div>
      </button>

      <button onClick={() => setIsCalendarModalOpen()} className={stylesSidever.sidebarButton}>
        <div className={stylesSidever.buttonContent}>
          <Image
            src={images.sideBarImage04}
            alt="Open Modal"
            width={150}
            height={50}
          />
        </div>
      </button>

      <div className={stylesSidever.imageContainer}>
        {/* 画像の上にCountDisplayを配置 */}
        <CountDisplay entries={entries} />
      </div>
    </aside>
  );
};

export default LeftSidebar;
