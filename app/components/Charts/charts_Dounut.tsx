///////////////////////////////////////////
//  円グラフデータ
///////////////////////////////////////////

//共通インポート
import React from 'react';
import styles from './charts_Dounut.module.css'; 
import local from '../local.module.css'
import { Entry } from '../type';


//関数をインポート
import { getDonutChartData, donutChartOptions } from './charts'; 

// Chart.js関連のインポート
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';

// Chart.jsコンポーネントの登録
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement
  );

interface ChartsUIProps {
  entries: Entry[];  // Entry型の配列
  latestEntry: Entry; // 最新のエントリ
  bodyFatPercentage: number; // 体脂肪率
}

const Charts_Dounut: React.FC<ChartsUIProps> = ({
  entries,
  latestEntry,
  bodyFatPercentage,
}) => {

  // ドーナツチャートのデータ
  const donutChartData = getDonutChartData(latestEntry);

  // UIコンポーネント
  return (
      <div className="grid-cols-2 gap-4 mb-8">
      {/* 体組成分析 */}

        {/* 左側の円グラフ */}
        <div className={`${styles.graphCard} ${styles.donutChart}`}>
          <div className={styles.graphTitle}>Body Composition Analysis</div>
          <Doughnut data={donutChartData} options={donutChartOptions} />
          <div className={styles.donutCenterLabel}>
            {bodyFatPercentage.toFixed(2)}
            <span className={styles.donutCenterLabel2}>%</span>
          </div>
        </div>
      </div>

  );
};

export default Charts_Dounut;
