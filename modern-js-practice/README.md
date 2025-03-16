# Modean JS Practice

Javascriptをモダンな記述へとリプレースする練習を通じて
現在のプログラムにマッチした記述を覚えていく

## リプレースの段階的手順
### 1.各機能の関数化
- 各機能を明確に
- MVCを意識して機能を分解する

### 2.MVCを意識したモジュール化
- データを扱う**モデル(M)**、表示を扱う**ビュー(V)**、モデルと表示の調整**コントロール(C)**に分解した関数をモジュールへ変換してエクスポート
- モデルモジュール、ビューモジュールをコントロールモジュールにインポートして操作

### 3.各機能のクラス化
- MVCそれぞれのモジュール内関数をクラス化
- Reactを意識して組み立てる

## モダンな記述へとリプレースした中での気づき
### 1.各機能の関数化
関数とクラスに機能を分ける感覚がなく、わかりやすい分解がとても苦手だったが、生成AI（Claude）のアドバイスに従い、とにかく細かく分けることを意識した。
↓以下Claudeのアドバイス

---

いきなりすべてをクラスで設計するのではなく、段階的に部品化していくのは非常に実践的な方法です。

## 段階的な部品化のステップ

### ステップ1: 関数による分割から始める
まずは関連する処理をシンプルな関数にまとめることから始めましょう。

```javascript
// タスクの表示を担当する関数
function renderTask(task) {
  const li = document.createElement('li');
  li.textContent = task.title;
  li.dataset.id = task.id;
  if (task.completed) {
    li.classList.add('completed');
  }
  return li;
}

// タスクリストの表示を担当する関数
function renderTaskList(tasks, container) {
  container.innerHTML = '';
  tasks.forEach(task => {
    container.appendChild(renderTask(task));
  });
}
```

### ステップ2: データ操作の関数を分ける
次にデータ操作に関する処理を分離します。

```javascript
// データ関連の関数
function addTask(tasks, title) {
  const newTask = {
    id: Date.now(),
    title,
    completed: false
  };
  return [...tasks, newTask];
}

function toggleTask(tasks, id) {
  return tasks.map(task => 
    task.id === id ? {...task, completed: !task.completed} : task
  );
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}
```

### ステップ3: モジュール化
関数をファイルに分割してモジュール化します。

```javascript
// taskRenderer.js
export function renderTask(task) { /* ... */ }
export function renderTaskList(tasks, container) { /* ... */ }

// taskOperations.js
export function addTask(tasks, title) { /* ... */ }
export function toggleTask(tasks, id) { /* ... */ }

// taskStorage.js
export function saveTasksToStorage(tasks) { /* ... */ }
export function loadTasksFromStorage() { /* ... */ }
```

### ステップ4: クラスへの段階的移行
関連する関数をまとめてクラスに変換します。

```javascript
// TaskRenderer.js
export class TaskRenderer {
  renderTask(task) { /* 元のrenderTask関数 */ }
  renderTaskList(tasks, container) { /* 元のrenderTaskList関数 */ }
}

// main.js
import { TaskRenderer } from './TaskRenderer.js';

const renderer = new TaskRenderer();
renderer.renderTaskList(tasks, container);
```

## 実践的なアドバイス

1. **一貫した命名規則を使う**
   - 関数: 動詞で始める (`renderTask`, `addTask`)
   - クラス: 名詞を使う (`TaskRenderer`, `TaskManager`)

2. **依存関係を意識する**
   - 一方向の依存関係を保つ（循環依存を避ける）
   - データの流れを明確にする

3. **テストしやすさを考慮する**
   - 副作用を分離する（DOM操作とデータ処理を分ける）
   - 入力と出力を明確にする

4. **小さく始める**
   - プロジェクト全体ではなく、まず一部の機能からリファクタリング
   - 例えば「タスク表示」や「タスク追加」など一つの機能から始める

クラス設計は経験を積むことで上達するスキルです。最初は小さなステップから始めて、徐々に理解を深めていくアプローチが効果的です。既存のコードを少しずつ改善していくことで、自然とクラス設計の感覚が身についていきます。

---

いままで苦手だったのは、機能などを考えずとにかく動くものを作り始めるので、すべてのコードが何をするのかつながっていない（その場限りの解決）で終わってしまうため。

なので、このプログラムで何を実現するのか、やはりはじめの設計が必要だと感じた。
（とはいえスモールゴールの意識をしないと、考え自体がまとまらないので、リプレース段階で設計を意識してもいい気はする）

---

**3/16追記**
Claude（生成AI）のアドバイスに従い、MVCを意識した関数機能分け、および各JSファイルに分離してモジュール読み込みを行う。
しかしMとVは理解できても、それをつなぐCがあまり理解できていなかったのか、色々と苦戦。

どうにかこうにかして動作確認できたものをコードビューで点数付けしてもらったものがこちら。

<a href="evaluation.md">Claudeの評価</a>

その後Claudeを質問攻めにしてみたものの、やはり自分の中にMVCが落とし込めていないようなので、気分転換のため一旦次のアプリ制作をする予定。（天気予報アプリ）