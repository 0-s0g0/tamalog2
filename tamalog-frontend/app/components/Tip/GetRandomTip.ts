// /utils/getRandomTip.js
import dietTips from './Diettips';

export function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * dietTips.length);
    return dietTips[randomIndex];
}
