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
const $countertxt = document.getElementById('countertxt');
const $plus = document.getElementById('plus');
const $minus = document.getElementById('minus');
const $reset = document.getElementById('reset');
const $includenum = document.getElementById('includenum');
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

$plus.addEventListener(_click, () => {
    if($includenum.value != ''){
        incNum = Number($includenum.value);
    };
    // console.log(incNum);
    counterNum += incNum;
    $countertxt.innerText = counterNum;
    if(counterNum <= 0) {
        $countertxt.classList.add('fcred');
    } else {
        $countertxt.classList.remove('fcred');
    }
    if(counterNum >= 10) {
        $countertxt.classList.add('fcgreen');
    } else {
        $countertxt.classList.remove('fcgreen');
    }
    localStorage.ttrlCounterNum = counterNum;
    // localStorage.setItem('ttrl_counter_num', counterNum);
    // if(counterNum < 10000) {
    // }
});
$minus.addEventListener(_click, () => {
    if($includenum.value != ''){
        incNum = Number($includenum.value);
    };
    counterNum -= incNum;
    $countertxt.innerText = counterNum;
    if(counterNum <= 0) {
        $countertxt.classList.add('fcred');
    } else {
        $countertxt.classList.remove('fcred');
    }
    if(counterNum >= 10) {
        $countertxt.classList.add('fcgreen');
    } else {
        $countertxt.classList.remove('fcgreen');
    }
    localStorage.ttrlCounterNum = counterNum;
    // localStorage.setItem('ttrl_counter_num', counterNum);
    // if(counterNum > -10000) {
    // }
});
$reset.addEventListener(_click, () => {
    counterNum = 0;
    $countertxt.innerText = counterNum;
    localStorage.removeItem('ttrlCounterNum');
    //localStorage.removeItem('ttrl_counter_num');
});
