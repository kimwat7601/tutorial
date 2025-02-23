//js

/*ローカル化
*/

// 厳格モード
"use strict";

/*--------------------------------
    Initial Setting
--------------------------------*/
// Click or Touch Auto
const touch_event = window.ontouchstart;
const _click = (touch_event === undefined) ? 'click' : 'touchstart';

// Media Query
const MQSP = window.matchMedia('(max-width: 960px)');
const IS_SP = MQSP.matches;

/*--------------------------------
    UA
--------------------------------*/

const userAgent = window.navigator.userAgent.toLowerCase();

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
const elTodoinputtext = document.querySelector('#todoinputtext');
const elEntrybtn = document.querySelector('#entrybtn');

const elTodolistListWrap = document.querySelector('#todolistListWrap');
// console.log(elTodoinputtext);

let objTodoListDatas = [];
let idCounterNum = 0;

const elTodolist = document.createElement('ul');
elTodolist.classList.add('todolist');

let elTodolistItem = '';
let elTodotextWrap = '';
let elTodoCheck = '';
let elTodoText = '';
let elBtnDelete = '';

// 機能別関数
function entryTodoData(idNum, inputTxt){
    idNum++;
    // console.log(objTodoListDatas);
    const dataObj = {
        id: idNum,
        todotxt: inputTxt,
        status: false
    }
    return datas.push(dataObj);
}



elEntrybtn.addEventListener(_click, function(e){
    // 登録ボタン処理
    // e.preventDefault();
    if(elTodoinputtext.value === ''){
        // テキスト入力欄が空欄の場合、処理を抜ける
        return;
    }
    const inputData = elTodoinputtext.value;
    if(objTodoListDatas.length === 0){
        elTodolistListWrap.appendChild(elTodolist);
    }
    
    // リストデータを追加
    objTodoListDatas = entryTodoData(idCounterNum, inputData);
    // idCounterNum++;
    // // console.log(objTodoListDatas);
    // const insertTodoistDataObj = {
    //     id: idCounterNum,
    //     todotxt: inputData,
    //     status: false
    // }
    // objTodoListDatas.push(insertTodoistDataObj);
    // console.log(objTodoListDatas);

    // フロント画面に描写
    while(elTodolist.firstChild) {
        elTodolist.removeChild(elTodolist.firstChild);
    }

    let fragment = document.createDocumentFragment();

    objTodoListDatas.forEach(function(objTodoListData){
        elTodolistItem = document.createElement('li');
        elTodolistItem.classList.add('todolist__item');
        elTodolistItem.dataset.id = objTodoListData.id;
        elTodotextWrap = document.createElement('span');
        elTodotextWrap.classList.add('todotext-wrap');
        elTodoCheck = document.createElement('input');
        elTodoCheck.type = 'checkbox';
        elTodoCheck.classList.add('todo-check');
        elTodoCheck.checked = objTodoListData.status ? 'checked' : '';
        elTodoText = document.createElement('span');
        elTodoText.classList.add('todo-text');
        elTodoText.innerText = objTodoListData.todotxt;
        elBtnDelete = document.createElement('button');
        elBtnDelete.type = 'button';
        elBtnDelete.classList.add('btn-delete');
        elBtnDelete.innerText = '削除';
        elTodotextWrap.append(elTodoCheck, elTodoText);
        elTodolistItem.append(elTodotextWrap, elBtnDelete);
        fragment.appendChild(elTodolistItem);
        //console.log(objTodoListData.todotxt);
    });
    console.log(fragment);
    elTodolist.appendChild(fragment);


    // テキスト入力欄を空欄に戻す
    elTodoinputtext.value = '';
});

elTodolistListWrap.addEventListener(_click, function(e){
    // 親要素にイベントリスナー登録
    if(e.target.type === 'button'){
        // 削除ボタンのみ処理
        const dataId = Number(e.target.parentNode.dataset.id);
        const updateObjTodoListDatas = objTodoListDatas.filter(function(objTodoListData){
            return objTodoListData.id != dataId;
        });
        //console.log(updateObjTodoListDatas);
        if(updateObjTodoListDatas.length > 0){
            while(elTodolist.firstChild) {
                elTodolist.removeChild(elTodolist.firstChild);
            }    
            updateObjTodoListDatas.forEach(function(objTodoListData){
                elTodolistItem = document.createElement('li');
                elTodolistItem.classList.add('todolist__item');
                elTodolistItem.dataset.id = objTodoListData.id;
                elTodotextWrap = document.createElement('span');
                elTodotextWrap.classList.add('todotext-wrap');
                elTodoCheck = document.createElement('input');
                elTodoCheck.type = 'checkbox';
                elTodoCheck.classList.add('todo-check');;
                elTodoCheck.checked = objTodoListData.status ? 'checked' : '';
                elTodoText = document.createElement('span');
                elTodoText.classList.add('todo-text');
                elTodoText.innerText = objTodoListData.todotxt;
                elBtnDelete = document.createElement('button');
                elBtnDelete.type = 'button';
                elBtnDelete.classList.add('btn-delete');
                elBtnDelete.innerText = '削除';
                elTodotextWrap.append(elTodoCheck, elTodoText);
                elTodolistItem.append(elTodotextWrap, elBtnDelete);
                elTodolist.appendChild(elTodolistItem);
            });    
        } else {
            elTodolist.remove();
        }
        objTodoListDatas = updateObjTodoListDatas;
    }
    
    //console.log(e.target.type);
    //console.log(objTodoListDatas);
});

elTodolistListWrap.addEventListener('change', function(e){
    // 親要素にイベントリスナー登録
    if(e.target.type === 'checkbox'){
        const dataId = Number(e.target.closest('.todolist__item').dataset.id);
        const findEl = objTodoListDatas.find(el => el.id === dataId);
        findEl.status = findEl.status === false ? true : false;
    }
    // console.log(objTodoListDatas);
});
