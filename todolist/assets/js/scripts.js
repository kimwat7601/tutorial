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

// ローカルストレージをオブジェクトに格納するための汎用クラス
class MyStorage {
    // アプリ名
    #app;
    // 利用するストレージの種類（ローカルストレージ）
    #storage = localStorage;
    // ストレージから読み込んだオブジェクト
    #data;

    constructor(app) {
        this.#app = app;
        this.#data = JSON.parse(this.#storage[this.#app] || '{}');
    }

    // 指定されたキーで値を取得
    getItem(key) {
        return this.#data[key];
    }

    // 指定されたキー/値でオブジェクトを書き換え
    setItem(key, value) {
        this.#data[key] = value;
    }

    // MyStorageオブジェクトの内容をストレージに保存
    save() {
        this.#storage[this.#app] = JSON.stringify(this.#data);
    }
}

// ローカルストレージのデータ（Json形式に変換）を初期データに格納
// let todolistSaveData;
// try{
//     todolistSaveData = JSON.parse(localStorage.getItem('todolistData')) || {datas: [], currentId: 0};
// } catch(e) {
//     console.log(e.message);
//     todolistSaveData = {datas: [], currentId: 0};
// }

// const todolistSaveData = JSON.parse(localStorage.getItem('todolistData'));
let storage = new MyStorage('appTodoList');

let objTodoListDatas;
let idCounterNum;

/**
 * ローカルストレージ保存用（JSON形式を文字列で保存）
 * @param {object} appname ストレージに保存するアプリ名
 */
function lsDataSave(){
    const lsObj = {
        datas: objTodoListDatas,
        currentId: idCounterNum
    };
    storage.setItem('todolistData', lsObj);
    storage.save();
}

// データが存在する時用のリストボックス
const elTodolist = document.createElement('ul');
elTodolist.classList.add('todolist');

// データが存在しない時用のメッセージ
const noDataMessage = document.createElement('p');
noDataMessage.innerText = '現在登録タスクはありません。';

/* 機能別関数
---------------------------*/
/**
 * データ登録用関数
 * @param {string} inputTxt 登録テキスト
 * @param {array} datas Todoリストデータ格納配列（各データはオブジェクト）
 */
function entryTodoDatas(inputTxt, datas){
    idCounterNum++;
    // console.log(idCounterNum);
    // console.log(objTodoListDatas);
    const dataObj = {
        id: idCounterNum,
        todotxt: inputTxt,
        status: false
    }
    datas.push(dataObj);
}

/**
 * document.createElement()のヘルパー関数
 * @param {string} tag HTMLタグ
 * @param {object} option 属性を追加するオプション（イベントリスナー追加にも対応）
 * @param  {...any} children タグに格納する子要素
 */
function createElement(tag, options = {}, ...children){
    const el = document.createElement(tag);

    // プロパティをセット
    Object.entries(options).forEach(([key, value]) => {
        // console.log(value);
        if(key.startsWith('on')){
            // イベントリスナーを追加（例：onClick -> click）
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if(key === 'class') {
            el.classList.add(...value.split(' '));
        } else if(key === 'dataset' && typeof value === 'object') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                el.dataset[dataKey] = dataValue;
            });
        } else {
            el[key] = value;
        }
    });

    // 子要素を追加
    children.forEach(child => {
        if(typeof child == 'string') {
            el.appendChild(document.createTextNode(child));
        } else if(child instanceof Node) {
            el.appendChild(child);
        };
    });

    return el;
}

/**
 * リストノード生成関数
 * @param {element} checkBox タスク完了用チェックボックス
 * @param {element} btnDelete タスク削除用ボタン
 * @param {number} id タスクID
 * @param {string} todoTxt タスク内容テキスト
 * @param {boolean} status 完了したか（したらTrue）
 * @returns 
 */

function listItemNodeCreate(id, todoTxt, status){
    const elTodolistItem = createElement(
        'li',
        {class: 'todolist__item', dataset: {id: id}},
        createElement('span',{class:'todotext-wrap'},
            createElement('input', {type: 'checkbox', class: 'todo-checkBox', onChange: onCompleteCheck, checked: status}),
            createElement('span', {class: 'todo-text'}, todoTxt)
        ),
        createElement('button', {class: 'btn-delete', onClick: onDeleteTodoClick}, '削除')
    );
    // const elTodolistItem = document.createElement('li');
    // elTodolistItem.classList.add('todolist__item');
    // elTodolistItem.dataset.id = id;
    // const elTodotextWrap = document.createElement('span');
    // elTodotextWrap.classList.add('todotext-wrap');
    // const checkBox = document.createElement('input');
    // checkBox.type = 'checkbox';
    // checkBox.classList.add('todo-check');
    // checkBox.checked = status ? 'checked' : '';
    // const elTodoText = document.createElement('span');
    // elTodoText.classList.add('todo-text');
    // elTodoText.innerText = todoTxt;
    // const btnDelete = document.createElement('button');
    // btnDelete.type = 'button';
    // btnDelete.classList.add('btn-delete');
    // btnDelete.innerText = '削除';
    // elTodotextWrap.append(checkBox, elTodoText);
    // elTodolistItem.append(elTodotextWrap, btnDelete);
    return elTodolistItem;
}

/**
 * リスト更新関数
 * @param {array} listObjArray Todoリストデータ格納配列（各データはオブジェクト）
 */
function updateList (listObjArray){
    while(elTodolist.firstChild) {
        elTodolist.removeChild(elTodolist.firstChild);
    }
    let fragment = document.createDocumentFragment();
    listObjArray.forEach(function(listObj){
        const elListItem = listItemNodeCreate(listObj.id, listObj.todotxt, listObj.status);
        fragment.appendChild(elListItem);
    });
    elTodolist.appendChild(fragment);
}

/**
 * 初期化関数
 */
function init(){
    const savedata = storage.getItem('todolistData');
    if(savedata) {
        objTodoListDatas = savedata.datas;
        idCounterNum = savedata.currentId;
    } else {
        objTodoListDatas = [];
        idCounterNum = 0;
    }
    if(objTodoListDatas.length > 0) {
        elTodolistListWrap.appendChild(elTodolist);
        updateList(objTodoListDatas);
    } else {
        elTodolistListWrap.appendChild(noDataMessage);
    }
}
init();

/**
 * 登録処理関数（ボタン、入力フォームリターン）
 * @returns 入力フォームが空欄のときに、処理を抜ける
 */
function entryTodo(){
    if(elTodoinputtext.value === ''){
        // テキスト入力欄が空欄の場合、処理を抜ける
        return;
    }
    const inputData = elTodoinputtext.value;
    if(objTodoListDatas.length === 0){
        while(elTodolistListWrap.firstChild) {
            elTodolistListWrap.removeChild(elTodolistListWrap.firstChild);
        }
        elTodolistListWrap.appendChild(elTodolist);
    }
    //console.log(idCounterNum);
    
    // リストデータを追加
    entryTodoDatas(inputData, objTodoListDatas);
    // フロント画面に描写
    updateList (objTodoListDatas);
    // ローカルストレージに保存
    lsDataSave();
    // 入力フォームを空欄に戻す
    elTodoinputtext.value = '';
}

elEntrybtn.addEventListener(_click, (e) => entryTodo());
elTodoinputtext.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        entryTodo();
    }
});

// 削除ボタン処理
function onDeleteTodoClick(e){
    e.preventDefault();
    //console.log('削除');
    const dataId = Number(e.target.parentNode.dataset.id);
    const updateObjTodoListDatas = objTodoListDatas.filter(function(objTodoListData){
        return objTodoListData.id != dataId;
    });
    if(updateObjTodoListDatas.length > 0){
        updateList (updateObjTodoListDatas);
    } else {
        elTodolist.remove();
        elTodolistListWrap.appendChild(noDataMessage);
    }
    objTodoListDatas = updateObjTodoListDatas;
    lsDataSave();
}

// 完了チェック処理
function onCompleteCheck(e){
    // チェックボックスの親要素からIDを抽出
    const dataId = Number(e.target.closest('.todolist__item').dataset.id);
    // TodoデータからIDを探し、抽出
    const findEl = objTodoListDatas.find(el => el.id === dataId);
    // 抽出データのステータスを変更
    findEl.status = findEl.status === false ? true : false;
    lsDataSave();
}
// elTodolistListWrap.addEventListener(_click, function(e){
//     // 削除ボタン処理
//     // 親要素にイベントリスナー登録
//     if(e.target.type === 'button'){
//         console.log('通過');
//         // 削除ボタンのみ処理
//         const dataId = Number(e.target.parentNode.dataset.id);
//         const updateObjTodoListDatas = objTodoListDatas.filter(function(objTodoListData){
//             return objTodoListData.id != dataId;
//         });
//         if(updateObjTodoListDatas.length > 0){
//             updateList (updateObjTodoListDatas);
//         } else {
//             elTodolist.remove();
//             elTodolistListWrap.appendChild(noDataMessage);
//         }
//         objTodoListDatas = updateObjTodoListDatas;
//         lsDataSaveAndGet();
//         // console.log(localStorage.getItem('todolistData'));
//     }
// });

// elTodolistListWrap.addEventListener('change', function(e){
//     // 親要素にイベントリスナー登録
//     if(e.target.type === 'checkbox'){
//         // 完了チェック処理
//         // チェックボックスの親要素からIDを抽出
//         const dataId = Number(e.target.closest('.todolist__item').dataset.id);
//         // TodoデータからIDを探し、抽出
//         const findEl = objTodoListDatas.find(el => el.id === dataId);
//         // 抽出データのステータスを変更
//         findEl.status = findEl.status === false ? true : false;
//         lsDataSave();
//     }
// });
