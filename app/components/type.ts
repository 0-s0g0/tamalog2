import { Settings } from "http2";

// Entryインターフェースの定義
export interface Entry {
    id: string;
    date: string;
    bodyWater: string;
    protein: string;
    minerals: string;
    bodyFat: string;
    totalWeight: number;
    /*
    totalmuscle: number;//bodywater+protein
    removeFat: number; //bodywater+protein+minerals
    goalWeight: string;//from nicknameMOdal
    goalFat: string;//from nicknameMOdal
    goalMuscle: string;//from nicknameMOdal
    nickname: string;//from nicknameMOdal
    icon: string;//from nicknameMOdal
    height:Settings; //from nicknameMOdal
    sex: string;//from nicknameMOdal
    */
  }
  