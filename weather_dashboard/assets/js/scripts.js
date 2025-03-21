//js

// 厳格モード
"use strict";

/*--------------------------------
    Initial Setting
--------------------------------*/
// Click or Touch Auto
// const touch_event = window.ontouchstart;
// const _click = (touch_event === undefined) ? 'click' : 'touchstart';

// // Media Query
// const MQSP = window.matchMedia('(max-width: 960px)');
// const IS_SP = MQSP.matches;

/*--------------------------------
    UA
--------------------------------*/

// const userAgent = window.navigator.userAgent.toLowerCase();

// const UA = {
//     IE:false,
//     EDGEOLD:false,
//     CHROME:false,
//     SAFARI:false,
//     FF:false,
//     OTHER:false
// }

//ブラウザそれぞれに判定用のフラグを設定
// if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
//     UA.IE = true;
// }else if(userAgent.indexOf('edge') != -1) {
//     UA.EDGEOLD = true;
// }else if(userAgent.indexOf('chrome') != -1) {
//     UA.CHROME = true;
// }else if(userAgent.indexOf('safari') != -1) {
//     UA.SAFARI = true;
// }else if(userAgent.indexOf('firefox') != -1) {
//     UA.FF = true;
// }else{
//     UA.OTHER = true;
// }

/*ローカル化
*/
document.addEventListener('DOMContentLoaded', function(){
    /*--------------------------------
        Initial Setting
    --------------------------------*/
    // Click or Touch Auto
    const touch_event = window.ontouchstart;
    const _click = (touch_event === undefined) ? 'click' : 'touchstart';

    const elTabItems = document.querySelectorAll('.tab-item');
    const elTabContents = document.querySelectorAll('.tab-contents');
    elTabItems.forEach((el) => {
        el.addEventListener(_click, (e) => {
            const tabId = el.dataset.tabid;
            const thisEl = document.getElementById(tabId);
            elTabContents.forEach((el) => {
                el.classList.remove('tab-contents--is-active');
            });
            elTabItems.forEach((el) => {
                el.classList.remove('tab-item--is-active');
            });
            el.classList.add('tab-item--is-active');
            thisEl.classList.add('tab-contents--is-active');
        });
    });
});
