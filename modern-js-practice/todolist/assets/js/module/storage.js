/**
 * Todoリストアプリデータ操作系モジュール
 */

/**
 * ローカルストレージをオブジェクトに格納するための汎用クラス
 */
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

//ローカルストレージクラスを格納
let storage = new MyStorage('appModeanTodoList');

////////////////////////
// ストレージ操作系関数
////////////////////////
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

// 関数をエクスポート
export {storage, MyStorage, saveTaskToStorage, loadTasksFromStorage};