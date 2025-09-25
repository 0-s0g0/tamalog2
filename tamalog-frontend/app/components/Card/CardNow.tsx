///////////////////////////////////////////
// 現在状態管理カード
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from './CardNow.module.css'; 
import local from './local.module.css'

//Image
import Image from 'next/image';
import { IoWater } from "react-icons/io5";
import NowWater_img from '../../public/NowWater.png';
import NowMineral_img from '../../public/NowMinerals.png';
import NowPritein_img from '../../public/NowPritein.png';


// Props型定義
interface Props {
  latestEntry: {
    bodyWater: string;
    protein: string;
    minerals: string;
  };
  previousEntry: {
    bodyWater: string;
    protein: string;
    minerals: string;
  };
}
const CardNow: React.FC<Props> = ({ latestEntry, previousEntry }) => {
    // 変化量を計算する関数
const calculateChange = (latest: string, previous: string) => {
    const latestValue = parseFloat(latest);
    const previousValue = parseFloat(previous);
    const change = latestValue - previousValue;

    if (change > 0) {
      return { change: change.toFixed(2), sign: <span className={styles.changeINIndicator}>▲+</span>, color: 'increase' };
    } else if (change < 0) {
      return { change: (-change).toFixed(2), sign: <span className={styles.changeOUTIndicator}>▼-</span>, color: 'decrease' };
    } else {
      return { change: '--', sign: '', color: 'noChange' };
    }
  };
  
  const bodyWaterChange = calculateChange(latestEntry.bodyWater, previousEntry.bodyWater);
  const proteinChange = calculateChange(latestEntry.protein, previousEntry.protein);
  const mineralsChange = calculateChange(latestEntry.minerals, previousEntry.minerals);


  return (
      <div className="grid-cols-2 gap-4 mb-8">

        {/* 右側のメトリックスカード */}
        <div className="flex flex-col gap-4">
          <div className={styles.metricCard}>
            <div className={styles.iconWrapper1}>
              <Image src={NowWater_img} alt='NowWater' width={30} height={30} />         
            </div>
            <div className={styles.metricContent}>
            <div className={styles.metricContent1}>
              <div className={styles.metricLabel}>Body Water</div>
                  <div className={styles.metricValue}>
                  {parseFloat(latestEntry.bodyWater).toFixed(2)}kg
                  </div>
              </div>
                      <span className={`${styles.changeIndicator} ${bodyWaterChange.color}`}>
                        {bodyWaterChange.sign}{bodyWaterChange.change}kg
                      </span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.iconWrapper2}>
              <Image src={NowPritein_img} alt='NowPritein' width={30} height={30} />         
            </div>
            <div className={styles.metricContent}>
            <div className={styles.metricContent1}>
              <div className={styles.metricLabel}>Body Protein</div>
                    <div className={styles.metricValue}>
                     {parseFloat(latestEntry.protein).toFixed(2)}kg
                    </div>
                    </div>
                      <span className={`${styles.changeIndicator} ${proteinChange.color}`}>
                        {proteinChange.sign}{proteinChange.change}kg
                      </span>
                
              </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.iconWrapper3}>
              <Image src={NowMineral_img} alt='NoeMinerals' width={30} height={30} />         
            </div>
            <div className={styles.metricContent}>
            <div className={styles.metricContent1}>
              <div className={styles.metricLabel}>Body Minerals</div>
                
                  <div className={styles.metricValue}>
                    {parseFloat(latestEntry.minerals).toFixed(2)}kg
                  </div>
                  </div>
                  <span className={`${styles.changeIndicator} ${mineralsChange.color}`}>
                    {mineralsChange.sign}{mineralsChange.change}kg
                  </span>
               
              </div>
            </div>
          </div>
      </div>
  );
};

export default CardNow;
