/**
 * Todoリストアプリデータ操作系モジュール
 */

import {saveTaskToStorage, loadTasksFromStorage} from './storage.js'
// import {renderTasks} from './view.js'

// elTodolistListWrap は外部から渡すように修正
let elTodolistListWrap;
let renderTasksFunction;

////////////////////////
// データ操作系関数
////////////////////////
/**
 * タスク追加用関数
 * @param {array} tasks タスクデータ格納配列（各データはオブジェクト）
 * @param {string} title 追加タスクタイトル
 */
function addTask(tasks, title){
    const newTask = {
        id: Date.now(),
        title,
        completed: false
    }
    // オブジェクトのkeyとvalueが同じ名前の場合、key（value？）を省略できる
    return [...tasks, newTask]
}

/**
 * 状態（完了/未完了）切り替え用関数
 * @param {array} tasks タスクリストデータ（各データはオブジェクト）
 * @param {number} id タスクID
 */
function toggleTask(tasks, id){
    // console.log(tasks);
    const updateTasks = tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task
        // {}を省略。{}を記述した場合、return を明示しないとエラーが表示される
    );
    // console.log(updateTasks);
    return updateTasks;
}

/**
 * データ削除用関数
 * @param {array} tasks タスクリストデータ（各データはオブジェクト）
 * @param {number} id タスクID
 * @returns 削除後のタスク
 */
function removeTask(tasks, id){
    return tasks.filter((tasks) => {
        return tasks.id != id;
    });
}

/**
 * 登録処理関数（ボタン、入力フォームリターン）
 * @returns 入力フォームが空欄のときに、処理を抜ける
 */
function entryTodo(event, inputEl){
    event.preventDefault();
    const objTodoListDatas = loadTasksFromStorage() ? loadTasksFromStorage() : [];
    // console.log(objTodoListDatas)
    if(inputEl.value === ''){
        // テキスト入力欄が空欄の場合、処理を抜ける
        return;
    }
    const inputData = inputEl.value.trim();
    // リストデータを追加
    //entryTodoDatas(inputData, objTodoListDatas);
    const newTasks = addTask(objTodoListDatas, inputData);
    // console.log(NewTasks);
    // フロント画面に描写
    // renderTasks (newTasks, elTodolistListWrap, onRemoveTodoClick, onCompleteCheck);
    if(renderTasksFunction){
        renderTasksFunction(newTasks, elTodolistListWrap, onCompleteCheck, onRemoveTodoClick);
    }
    // ローカルストレージに保存
    saveTaskToStorage(newTasks);
    // 入力フォームを空欄に戻す
    inputEl.value = '';
}

// テキスト入力から直接登録する処理
function entryTodoInput(e, el){
    if(e.key === 'Enter'){
        entryTodo(e, el);
    }
}

// 削除ボタン処理
function onRemoveTodoClick(e){
    e.preventDefault();
    const objTodoListDatas = loadTasksFromStorage();
    const dataId = Number(e.target.parentNode.dataset.id);
    const updateObjTodoListDatas = removeTask(objTodoListDatas, dataId);
    // renderTasks (updateObjTodoListDatas, elTodolistListWrap, onRemoveTodoClick, onCompleteCheck);
    if(renderTasksFunction){
        renderTasksFunction(updateObjTodoListDatas, elTodolistListWrap, onCompleteCheck, onRemoveTodoClick);
    }
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

function setTodolistListWrap(element){
    elTodolistListWrap = element;
}

function setRenderTasksFunction(fn){
    renderTasksFunction = fn;
}

// 関数をエクスポート
export {addTask, toggleTask, removeTask, entryTodo, entryTodoInput, onRemoveTodoClick, onCompleteCheck, setTodolistListWrap, setRenderTasksFunction};