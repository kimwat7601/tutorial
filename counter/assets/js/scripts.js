//js

/*--------------------------------
    Initial Setting
--------------------------------*/
// Click or Touch Auto
var touch_event = window.ontouchstart;
var _click = (touch_event === undefined) ? 'click' : 'touchstart';

// Media Query
const MQSP = window.matchMedia('(max-width: 960px)');
const IS_SP = MQSP.matches;

/*--------------------------------
    UA
--------------------------------*/

var userAgent = window.navigator.userAgent.toLowerCase();

const UA = {
    IE:false,
    EDGEOLD:false,
    CHROME:false,
    SAFARI:false,
    FF:false,
    OTHER:false
}

//ブラウザそれぞれに判定用のフラグを設定
if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
    UA.IE = true;
}else if(userAgent.indexOf('edge') != -1) {
    UA.EDGEOLD = true;
}else if(userAgent.indexOf('chrome') != -1) {
    UA.CHROME = true;
}else if(userAgent.indexOf('safari') != -1) {
    UA.SAFARI = true;
}else if(userAgent.indexOf('firefox') != -1) {
    UA.FF = true;
}else{
    UA.OTHER = true;
}

/*--------------------------------
    Variable Setting
--------------------------------*/
// DOM
const ElCounterTxt = document.getElementById('countertxt');
const ElPlus = document.getElementById('plus');
const ElMinus = document.getElementById('minus');
const ElReset = document.getElementById('reset');
const ElIncludenum = document.getElementById('includenum');

// Setting
const underClassName = 'fcred';
const overClassName = 'fcgreen';
const underClassNum = 0;
const overClassNum = 10;
const minNum = -30;
const maxNum = 30;

// console.log(ElCounterTxt);

// カウンターナンバー初期化（ローカルストレージに保持されていたら表示）
let counterNum = localStorage.getItem('ttrlCounterNum') ? Number(localStorage.getItem('ttrlCounterNum')) : 0;
updateClass(counterNum);

ElCounterTxt.innerText = counterNum;

/**
 * 数値を増減する関数
 * @param {number} orgnum 元の数値
 * @param {boolean} isPlus プラスかマイナスか。Trueならプラス
 * @param {number} incNum 増減する値。デフォルトは1
 * @param {number} minnum 最小値
 * @param {number} maxnum 最大値
 * @returns {number} 増減後の数値を返す
 */
function numberChange(orgnum, isPlus, incNum, minnum, maxnum){
    let resultNum = isPlus ? orgnum + incNum : orgnum - incNum;
    resultNum = Math.max(resultNum, minnum);
    resultNum = Math.min(resultNum, maxnum);
    return Math.min(Math.max(resultNum, minnum), maxnum);
}
/**
 * 数値でクラスを付与する関数
 * @param {number} num クラスを付与する数値 
 */
function updateClass(num){
    ElCounterTxt.classList.toggle(underClassName, num <= underClassNum);
    ElCounterTxt.classList.toggle(overClassName, num >= overClassNum);
}

/**
 * プラス、マイナスボタンを押すと数値が変わる関数
 * @param {boolean} isPlus プラスかマイナスか。Trueならプラス
 */
function updateCounter(isPlus) {
    let incNum = ElIncludenum.value ? Number(ElIncludenum.value) : 1;
    counterNum = numberChange(counterNum, isPlus, incNum, minNum, maxNum);
    ElCounterTxt.innerText = counterNum;
    updateClass(counterNum);
    localStorage.setItem('ttrlCounterNum', counterNum);
}

//「+」ボタンを押した時
ElPlus.addEventListener(_click, () => updateCounter(true));

//「-」ボタンを押した時
ElMinus.addEventListener(_click, () => updateCounter(false));

//リセットボタンを押した時
ElReset.addEventListener(_click, () => {
    counterNum = 0;
    ElCounterTxt.innerText = counterNum;
    localStorage.removeItem('ttrlCounterNum');
});


