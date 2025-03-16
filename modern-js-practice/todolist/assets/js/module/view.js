/**
 * Todoリストアプリ表示系モジュール
 */

/*--------------------------------
    Initial Setting
--------------------------------*/
// Click or Touch Auto
const touch_event = window.ontouchstart;
const _click = (touch_event === undefined) ? 'click' : 'touchstart';

// データが存在しない時用のメッセージ
const noDataMessage = document.createElement('p');
noDataMessage.innerText = '現在登録タスクはありません。';

////////////////////////
// 表示系（DOM操作）関数
////////////////////////
/**
 * 登録フォーム表示
 * @param {element} parent : 登録フォームを格納する親要素
 */
function renderForm(parent, onSubmit, onInputKeyDown){
    const elFormBox = document.createElement('div');
    elFormBox.classList.add('todolist-formbox');
    const elTodoInputText = document.createElement('input');
    elTodoInputText.name = "todo-input-text";
    elTodoInputText.id = 'todoinputtext';
    elTodoInputText.classList.add('todo-input-text');
    elTodoInputText.required = 'required';
    elTodoInputText.addEventListener('keydown', (e) => onInputKeyDown(e, elTodoInputText));
    const elBtnEntry = document.createElement('button');
    elBtnEntry.type = 'submit';
    elBtnEntry.id = 'entrybtn';
    elBtnEntry.classList.add('btn-entry');
    elBtnEntry.textContent = '登録';
    elBtnEntry.addEventListener(_click,  (e) => onSubmit(e, elTodoInputText));
    elFormBox.append(elTodoInputText, elBtnEntry);
    parent.appendChild(elFormBox);
}

/**
 * タスクの表示
 * @param {object} task : 各タスクデータ
 * @returns : 各タスクのli要素
 */
function renderTask(task, onComplete, onRemove){
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
    elCheckBox.addEventListener('change', onComplete);
    // Create span.todo-text
    const elTodoText = document.createElement('span');
    elTodoText.classList.add('todo-text');
    elTodoText.textContent = task.title;
    // Create button
    const elBtnDelete = document.createElement('button');
    elBtnDelete.classList.add('btn-delete');
    elBtnDelete.textContent = '削除';
    elBtnDelete.addEventListener(_click, onRemove);
    // 格納
    elTodotextWrap.append(elCheckBox, elTodoText);
    elTodolistItem.append(elTodotextWrap, elBtnDelete);
    return elTodolistItem;
}

/**
 * タスクリストの表示
 * @param {array} tasks : タスクの配列（各タスクはオブジェクト）
 * @param {element} container : タスク全体を格納する要素
 */
function renderTasks(tasks, container, onComplete, onRemove){
    // 格納エレメントから要素を削除
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    if(tasks.length > 0){
    // タスクがある場合
        const palentEl = document.createElement('ul');
        palentEl.classList.add('todolist');
        let fragment = document.createDocumentFragment();
        tasks.forEach((task) => {
            fragment.appendChild(renderTask(task, onComplete, onRemove));
        });
        palentEl.appendChild(fragment);
        container.appendChild(palentEl);
    } else {
        // タスクがない場合
        container.appendChild(noDataMessage);
    }
}

// 関数をエクスポート
export {renderForm, renderTasks};