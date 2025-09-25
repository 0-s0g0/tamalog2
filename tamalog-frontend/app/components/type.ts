// Entryインターフェースの定義
export interface Entry {
    id: string;
    date: string;
    bodyWater: string;
    protein: string;
    minerals: string;
    bodyFat: string;
    totalWeight: number;
    totalMuscle: number;//bodywater+protein
    removeFat: number; //bodywater+protein+minerals
  }
  
// EntryACインターフェースの定義
  export interface EntryAC {
    id: string;
    goalWeight: string;//from nicknameMOdal
    goalFat: string;//from nicknameMOdal
    goalMuscle: string;//from nicknameMOdal
    nickname: string;//from nicknameMOdal
    icon: string;//from nicknameMOdal
    height:string; //from nicknameMOdal
    sex: string;//from nicknameMOdal
  }

  export interface EntrySports {
    id: string;  // ユーザーID
    date: string;  // 選択した日付
    icon: string;  // 選択したスポーツのアイコン
    time: string;  // 記録された時間
  }