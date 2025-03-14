//js
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

// Task Data
/**
 * taskオブジェクト
 * task = {
 *  title: string,
 *  id: number,
 *  complete: boolean
 * }
 */

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
let storage = new MyStorage('appModeanTodoList');

// let objTodoListDatas;
// let idCounterNum;

// データが存在する時用のリストボックス
const elTodolist = document.createElement('ul');
elTodolist.classList.add('todolist');

// データが存在しない時用のメッセージ
const noDataMessage = document.createElement('p');
noDataMessage.innerText = '現在登録タスクはありません。';

/* 機能別関数
---------------------------*/

// 表示系（DOM操作）関数
// タスクの表示
// <li class="todolist__item">
//  <span class="todotext-wrap">
//     <input type="checkbox" name="" class="todo-check">
//     <span class="todo-text">Todoリスト</span>
//  </span>
//  <button class="btn-delete">削除</button>
// </li>

function renderTask(task){
    // Create li
    const elTodolistItem = document.createElement('li');
    elTodolistItem.classList.add('todolist__item');
    elTodolistItem.dataset.id = task.id;
    // Create span.todotext-wrap
    const elTodotextWrap = document.createElement('span');
    elTodotextWrap.classList.add('todotext-wrap');
    // Create input Checkbox
    const elCheckBox = document.createElement('input');
    elCheckBox.type = 'checkbox';
    elCheckBox.classList.add('todo-check');
    elCheckBox.checked = task.completed ? 'checked' : '';
    elCheckBox.addEventListener('change', onCompleteCheck);
    // Create span.todo-text
    const elTodoText = document.createElement('span');
    elTodoText.classList.add('todo-text');
    elTodoText.textContent = task.title;
    // Create button
    const elBtnDelete = document.createElement('button');
    elBtnDelete.classList.add('btn-delete');
    elBtnDelete.textContent = '削除';
    elBtnDelete.addEventListener(_click, onDeleteTodoClick);
    // 格納
    elTodotextWrap.append(elCheckBox, elTodoText);
    elTodolistItem.append(elTodotextWrap, elBtnDelete);
    return elTodolistItem;
}

// /**
//  * リスト更新関数
//  * @param {array} listObjArray Todoリストデータ格納配列（各データはオブジェクト）
//  */
// function updateList (listObjArray){
//     while(elTodolist.firstChild) {
//         elTodolist.removeChild(elTodolist.firstChild);
//     }
//     let fragment = document.createDocumentFragment();
//     listObjArray.forEach(function(listObj){
//         const elListItem = listItemNodeCreate(listObj.id, listObj.todotxt, listObj.status);
//         fragment.appendChild(elListItem);
//     });
//     elTodolist.appendChild(fragment);
// }

// タスクリストの表示
function renderTasks(tasks, container){
    // console.log(container);
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    let fragment = document.createDocumentFragment();
    tasks.forEach((task) => {
        fragment.appendChild(renderTask(task));
    });
    container.appendChild(fragment);
}

//データ関連の関数
/**
 * データ登録用関数
 * @param {array} tasks Todoリストデータ格納配列（各データはオブジェクト）
 * @param {string} title 登録テキスト
 */
function addTask(tasks, title){
    const newTask = {
        id: Date.now(),
        title,
        completed: false
    }
    // console.log(newTask.title);
    return [...tasks, newTask]
}

/**
 * 状態切り替え用関数
 * @param {array} tasks タスクリストデータ
 * @param {number} id タスクID
 */
function toggleTask(tasks, id){
    // console.log(tasks);
    const updateTasks = tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task
        // console.log(task.id + ',' + id);
    );
    console.log(updateTasks);
    return updateTasks;
}

/**
 * データ削除用関数
 * @param {array} tasks タスクリストデータ（タスクはオブジェクト）
 * @param {number} id タスクID
 * @returns 削除後のタスク
 */
function deleteTask(tasks, id){
    return tasks.filter((tasks) => {
        return tasks.id != id;
    });
}

/**
 * ローカルストレージ保存用関数（JSON形式を文字列で保存）
 * @param {array} tasks ストレージに保存するタスク
 */
function saveTaskToStorage(tasks){
    storage.setItem('todolistData', tasks);
    storage.save();
}

/**
 * ローカルストレージ呼び出し用関数
 * @returns 呼び出したタスク（オブジェクトの配列）
 */
function loadTasksFromStorage(){
    return storage.getItem('todolistData');
}

/**
 * 初期化関数
 */
function init(){
    const savedata = loadTasksFromStorage();
    // console.log(savedata);
    if(savedata){
        elTodolistListWrap.appendChild(elTodolist);
        renderTasks(savedata, elTodolist);
        // objTodoListDatas = savedata;
    } else {
        // objTodoListDatas = [];
        elTodolistListWrap.appendChild(noDataMessage);
    }
}
init();

/**
 * 登録処理関数（ボタン、入力フォームリターン）
 * @returns 入力フォームが空欄のときに、処理を抜ける
 */
function entryTodo(){
    const objTodoListDatas = loadTasksFromStorage() ? loadTasksFromStorage() : [];
    // console.log(objTodoListDatas)
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
    //entryTodoDatas(inputData, objTodoListDatas);
    const NewTasks = addTask(objTodoListDatas, inputData);
    // console.log(NewTasks);
    // フロント画面に描写
    renderTasks (NewTasks, elTodolist);
    // ローカルストレージに保存
    saveTaskToStorage(NewTasks);
    // 入力フォームを空欄に戻す
    elTodoinputtext.value = '';
}

// 削除ボタン処理
function onDeleteTodoClick(e){
    e.preventDefault();
    const objTodoListDatas = loadTasksFromStorage();
    const dataId = Number(e.target.parentNode.dataset.id);
    const updateObjTodoListDatas = deleteTask(objTodoListDatas, dataId);
    if(updateObjTodoListDatas.length > 0){
        renderTasks (updateObjTodoListDatas, elTodolist);
    } else {
        elTodolist.remove();
        elTodolistListWrap.appendChild(noDataMessage);
    }
    // objTodoListDatas = updateObjTodoListDatas;
    saveTaskToStorage(updateObjTodoListDatas);
}

// 完了チェック処理
function onCompleteCheck(e){
    const objTodoListDatas = loadTasksFromStorage();
    // チェックボックスの親要素からIDを抽出
    const dataId = Number(e.target.closest('.todolist__item').dataset.id);
    // チェックボックスの状態で該当タスクの状態を切り替え
    const updateObjTodoListDatas = toggleTask(objTodoListDatas, dataId);
    
    saveTaskToStorage(updateObjTodoListDatas);
}

// 登録ボタン操作
elEntrybtn.addEventListener(_click, (e) => entryTodo());
elTodoinputtext.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        entryTodo();
    }
});