// components/CountDisplay.tsx
import React from 'react';
import { Entry } from '../type'; // Entry型をインポート
import style from './LeftSidebar.module.css';

// entriesを引数で受け取るように変更
interface CountDisplayProps {
  entries: Entry[];
}

const CountDisplay: React.FC<CountDisplayProps> = ({ entries }) => {
  return (
    <div className={style.countext}>
      <h2>{entries.length}</h2>
    </div>
  );
};

export default CountDisplay;
