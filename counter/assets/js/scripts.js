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
const $countertxt = document.getElementById('countertxt');
const $plus = document.getElementById('plus');
const $minus = document.getElementById('minus');
const $reset = document.getElementById('reset');
const $includenum = document.getElementById('includenum');

// Setting
const underClass = 'fcred';
const overClass = 'fcgreen';
const underClassNum = 0;
const overClassNum = 10;
const minNum = -30;
const maxNum = 30;

// console.log($countertxt);

let counterNum = 0;
console.log(localStorage.ttrlCounterNum);
if(localStorage.ttrlCounterNum){
    counterNum = Number(localStorage.ttrlCounterNum);
}
// console.log(localStorage.saveKey);

// console.log(localStorage.getItem('ttrl_counter_num'));
// if(localStorage.getItem('ttrl_counter_num')){
//     counterNum = localStorage.getItem('ttrl_counter_num');
// }
let incNum = 1;
$countertxt.innerText = counterNum;

// 
function numberChange(orgnum, inctype, incNum = 1, minnum = -Infinity, maxnum = Infinity){
    let resultNum = 0;
    if(inctype === 'plus'){
        resultNum = orgnum + incNum;  
    } else if(inctype === 'minus') {
        resultNum = orgnum - incNum;  
    }
    if(resultNum < minnum) {
        resultNum = minnum;
    }
    if(resultNum > maxnum) {
        resultNum = maxnum;
    }
    return resultNum;
}

function classChange(minClassName = '', maxClassName = '',  minnum = -Infinity, maxnum = Infinity){
    if(counterNum <= minnum) {
        $countertxt.classList.add(minClassName);
    } else {
        $countertxt.classList.remove(minClassName);
    }
    if(counterNum >= maxnum) {
        $countertxt.classList.add(maxClassName);
    } else {
        $countertxt.classList.remove(maxClassName);
    }
}

//「+」ボタンを押した時
$plus.addEventListener(_click, () => {
    if($includenum.value != ''){
        incNum = Number($includenum.value);
    };
    // console.log(incNum);
    counterNum = numberChange(counterNum, 'plus', incNum, minNum, maxNum);
    $countertxt.innerText = counterNum;
    classChange(underClass, overClass, underClassNum, overClassNum);
    localStorage.ttrlCounterNum = counterNum;
});

//「-」ボタンを押した時
$minus.addEventListener(_click, () => {
    if($includenum.value != ''){
        incNum = Number($includenum.value);
    };
    counterNum = numberChange(counterNum, 'minus', incNum, minNum, maxNum);
    $countertxt.innerText = counterNum;
    classChange(underClass, overClass, underClassNum, overClassNum);
    localStorage.ttrlCounterNum = counterNum;
});

//リセットボタンを押した時
$reset.addEventListener(_click, () => {
    counterNum = 0;
    $countertxt.innerText = counterNum;
    localStorage.removeItem('ttrlCounterNum');
    //localStorage.removeItem('ttrl_counter_num');
});


