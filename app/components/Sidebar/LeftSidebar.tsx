import React,{useState} from 'react';
import Image from 'next/image';  // Next.jsの場合
import logo from '../../public/logo2.png';
import sideBarImageOUT00 from '../../public/Sidever_imageOUT000.png';
import sideBarImage00 from '../../public/Sidever_image000.png';
import sideBarImage01 from '../../public/Sidever_image001a.png';
import sideBarImage02 from '../../public/Sidever_image002.png';
import sideBarImage03 from '../../public/Sidever_image003.png';
import sideBarImage04 from '../../public/Sidever_image004.png';

import sideBarImageOUT00b from '../../public/Sidever_imageOUT000b.png';
import sideBarImage00b from '../../public/Sidever_image000b.png';
import sideBarImage01b from '../../public/Sidever_image001b.png';
import sideBarImage02b from '../../public/Sidever_image002b.png';
import sideBarImage03b from '../../public/Sidever_image003b.png';
import sideBarImage04b from '../../public/Sidever_image004b.png';


import stylesSidever from './LeftSidebar.module.css';
import CountDisplay from './Countdisplay';
import { Entry } from '../type';
  
  interface LeftSidebarProps {
  isLoggedIn: boolean;
  setIsLogoutModalOpen: (isOpen: boolean) => void;
  setIsSignUpModalOpen: (isOpen: boolean) => void;
  setIsTextInputModalOpen: (isOpen: boolean) => void;
  setIsImageInputModalOpen: (isOpen: boolean) => void;
  setIsNicknameModalOpen: (isOpen: boolean) => void;
  setIsCalendarModalOpen: (isOpen: boolean) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isLoggedIn,
  setIsLogoutModalOpen,
  setIsSignUpModalOpen,
  setIsTextInputModalOpen,
  setIsImageInputModalOpen,
  setIsNicknameModalOpen,
  setIsCalendarModalOpen,
}) =>  {
  const [entries, setEntries] = useState<Entry[]>([]); 
  return (
    <aside className={stylesSidever.sidebar}>
      <Image src={logo} alt="Logo" width={200} />
      <div className={stylesSidever.sidebarA}>
        {isLoggedIn ? (
          <button onClick={() => setIsLogoutModalOpen(true)} className={stylesSidever.sidebarButton}>
            <div className={stylesSidever.buttonContent}>
              <Image src={sideBarImageOUT00} alt="Logout" width={150} />
            </div>
          </button>
        ) : (
          <button onClick={() => setIsSignUpModalOpen(true)} className={stylesSidever.sidebarButton}>
            <div className={stylesSidever.buttonContent}>
              <Image src={sideBarImage00} alt="Sign Up" width={150} />
            </div>
          </button>
        )}

        <button onClick={() => setIsTextInputModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage01} alt="Text Input" width={150} />
          </div>
        </button>

        <button onClick={() => setIsImageInputModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage02} alt="Image Input" width={150} />
          </div>
        </button>

        <button onClick={() => setIsNicknameModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage03} alt="Nickname" width={150} />
          </div>
        </button>

        <button onClick={() => setIsCalendarModalOpen(true)} className={stylesSidever.sidebarButton}>
          <div className={stylesSidever.buttonContent}>
            <Image src={sideBarImage04} alt="Calendar" width={150} />
          </div>
        </button>
      </div>
      <div className={stylesSidever.imageContainer}>
        <CountDisplay entries={entries} />
      </div>
    </aside>
  );
};

export default LeftSidebar;
