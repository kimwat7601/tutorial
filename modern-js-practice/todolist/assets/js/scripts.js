// 各モジュール呼び出し
import {storage, MyStorage, saveTaskToStorage, loadTasksFromStorage} from './module/storage.js'
import {addTask, toggleTask, removeTask, entryTodo, entryTodoInput, onRemoveTodoClick, onCompleteCheck, setTodolistListWrap, setRenderTasksFunction} from './module/model.js'
import {renderForm, renderTasks} from './module/view.js'

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
const elModernTodolist = document.querySelector('#m-todolist');

// Todoリスト格納用ボックス
const elTodolistListWrap = document.createElement('div');
elTodolistListWrap.classList.add('todolist-listWrap');
elTodolistListWrap.id = 'todolistListWrap';

// データ関連の関数
// addTask();

/**
 * 初期化関数
 */
function init(){
    const savedata = loadTasksFromStorage();
    const elForm = document.createElement('form');
    const parentElement = elModernTodolist.appendChild(elForm);

    setTodolistListWrap(elTodolistListWrap);
    setRenderTasksFunction(renderTasks);
    // console.log(parentElement);
    renderForm(
        parentElement,
        entryTodo,
        entryTodoInput
    );

    parentElement.appendChild(elTodolistListWrap);
    
    // console.log(savedata);
    renderTasks(
        savedata,
        elTodolistListWrap,
        onCompleteCheck,
        onRemoveTodoClick
    );
}
init();