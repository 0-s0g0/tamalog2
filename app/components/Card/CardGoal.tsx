
//共通インポート
import React from 'react';
import styles from './CardGoal.module.css'; 
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

const CardGoal: React.FC<Props> = ({ latestEntryAC, latestEntry }) => {
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
      {/* Goal Weight */}
      <div className={styles.metricCard00}>
  <div className={styles.iconWrapper}>
    <FaWeightScale size={100} color={'#ffffff'} />      
  </div>
  <div className={styles.metricContent}>
    <div className={styles.metricLabel}>Goal Weight</div>
      <div className={styles.metricValue}>
        あと{goalWeightChange.sign}{goalWeightChange.change}kg
      </div>
    <span className={`${styles.changeIndicator} ${goalWeightChange.color}`}>
      {parseFloat(latestEntryAC.goalWeight).toFixed(2)}kg
    </span>
  </div>
</div>

      {/* Goal Fat */}
      <div className={styles.metricCard00}>
          <div className={styles.iconWrapper}>
              <GiFat size={100} color={'#ffffff'} />   
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Goal Fat</div>
            <div className={styles.metricValue}>
              あと{goalFatChange.sign}{goalFatChange.change}kg
            </div>
            <span className={`${styles.changeIndicator} ${goalFatChange.color}`}>
              {parseFloat(latestEntryAC.goalFat).toFixed(2)}kg
            </span>
        </div>
      </div>

      {/* Goal Muscle */}
      <div className={styles.metricCard00}>
        <div className={styles.iconWrapper}>
          <GiMuscleFat size={100} color={'#ffffff'} />   
        </div>
        <div className={styles.metricContent}>
          <div className={styles.metricLabel}>Goal Muscle</div>
          <div className={styles.metricValue}>
            あと{goalMuscleChange.sign}{goalMuscleChange.change}kg
          </div>
          <span className={`${styles.changeIndicator} ${goalMuscleChange.color}`}>
          {parseFloat(latestEntryAC.goalMuscle).toFixed(2)}kg
          </span>
        </div>
      </div>
      <div style={{height:'10px', backgroundColor:'red'}}></div>
    </div>

  );
};

export default CardGoal;
