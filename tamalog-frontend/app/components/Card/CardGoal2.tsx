//共通インポート
import React from 'react';
import styles from './CardGoal2.module.css'; 
import { GiFat, GiMuscleFat } from "react-icons/gi";
import { FaWeightScale } from 'react-icons/fa6';

// Props型定義
interface Props {
  latestEntryAC: {
    goalWeight: string;
    goalFat: string;
    goalMuscle: string;
  };
  latestEntry: {
    totalWeight: number;
    bodyFat: string;
    totalMuscle: number;
  };
}

const CardGoal2: React.FC<Props> = ({ latestEntryAC, latestEntry }) => {
  // 変化量を計算する関数
const calculateChange = (goal: string, actual: string) => {
  const goalValue = parseFloat(goal);
  const actualValue = parseFloat(actual);
  const change = goalValue - actualValue;

  if (change > 0) {
    return { change: change.toFixed(2), sign: <span className="text-green-500">+</span>, color: 'increase' };
  } else if (change < 0) {
    return { change: (-change).toFixed(2), sign: <span className="text-red-500">-</span>, color: 'decrease' };
  } else {
    return { change: '--', sign: '', color: 'noChange' };
  }
};

// `latestEntryAC` と `latestEntry` の値が正常かチェックしてから計算
const goalWeightChange = calculateChange(latestEntryAC.goalWeight, latestEntry.totalWeight.toString());
const goalFatChange = calculateChange(latestEntryAC.goalFat, latestEntry.bodyFat.toString());
const goalMuscleChange = calculateChange(
  latestEntryAC.goalMuscle,
  (latestEntry.totalMuscle ? latestEntry.totalMuscle : 0).toString() // totalMuscleがundefinedの場合は0を使う
);

  return (
    <div className={styles.goalAll}>
      <div className={styles.goalContainer}>
        {/* Goal Fat (Left) */}
        <div className={styles.sideCard}>
          <div className={styles.iconWrapper}>
            <GiFat size={30} color={'#ffffff'} />   
          </div>
          <div className={styles.sideCardContent}>
            <div className={styles.sideCardValue}>
              {goalFatChange.sign}{goalFatChange.change}kg
            </div>
            <div className={styles.sideCardLabel}>BodyFat</div>
          </div>
        </div>

        {/* Goal Weight (Center) */}
        <div className={styles.centerCard}>
          <div className={styles.centerIconWrapper}>
            <FaWeightScale size={50} color={'#9e8579'} />      
          </div>
          <div className={styles.centerCardContent}>

            <div className={styles.centerCardValue}>
              {goalWeightChange.sign}{goalWeightChange.change}kg
            </div>
            <div className={styles.centerCardSubLabel}>Weight</div>
          </div>
        </div>

        {/* Goal Muscle (Right) */}
        <div className={styles.sideCard}>
          <div className={styles.iconWrapper}>
            <GiMuscleFat size={30} color={'#ffffff'} />   
          </div>
          <div className={styles.sideCardContent}>
            <div className={styles.sideCardValue}>
              {goalMuscleChange.sign}{goalMuscleChange.change}kg
            </div>
            <div className={styles.sideCardLabel}> Muscle</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGoal2;