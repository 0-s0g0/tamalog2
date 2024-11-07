///////////////////////////////////////////
// 10. グラフデータ
///////////////////////////////////////////

//共通インポート
import { Entry } from './type'; 

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
    labels: ['体水分', 'タンパク質', 'ミネラル', '体脂肪'],
    datasets: [
      {
        data: [
          parseFloat(latestEntry.bodyWater),
          parseFloat(latestEntry.protein),
          parseFloat(latestEntry.minerals),
          parseFloat(latestEntry.bodyFat),
        ],
        backgroundColor: ['#99CCFF', '#9EFFCE', '#FFFF9E', '#FF9E9E'],
        borderWidth: 1,
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







