///////////////////////////////////////////
// 10. グラフデータ
///////////////////////////////////////////

//共通インポート
import { Entry } from '../type'; 

//関数のエクスポート
//折れ線グラフのデータ
export const getLineChartData = (entries: Entry[]) => {
  return {
    labels: entries.map(entry => entry.date),
    datasets: [
      {
        label: '体重',
        data: entries.map(entry => entry.totalWeight),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };
};

// ドーナツチャートのデータ
export const getDonutChartData = (latestEntry: Entry) => {
  return {
    labels: ['体水分', 'タンパク質', 'ミネラル', '体脂肪'],  // グラフのラベル
    datasets: [
      {
        data: [
          parseFloat(latestEntry.bodyWater),  // 体水分
          parseFloat(latestEntry.protein),    // タンパク質
          parseFloat(latestEntry.minerals),   // ミネラル
          parseFloat(latestEntry.bodyFat),    // 体脂肪
        ],
        backgroundColor: ['#9fbcde', '#acdbb7', '#FFC374', '#FF9E9E'], // 円グラフの各セクションの色
        borderWidth: 1, // 円グラフのセクションの枠線の太さ
      },
    ],
  };
};


// ドーナツチャートのオプション
export const donutChartOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kg`;
        },
      },
    },
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      formatter: (value: number) => value.toFixed(2),
      color: '#fff',
      font: {
        weight: 'bold',
      },
    },
  },
  cutout: '70%',
};







