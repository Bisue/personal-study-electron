# Electron 프로세스 모델

### Electron의 프로세스 모델

Electron은 크로미움(Chromium)의 멀티 프로세스 구조를 사용한다. 이는 Electron이 구조적으로 현대 웹 브라우저와 매우 비슷함을 의미한다.

&nbsp;

### 일반적인 웹 브라우저에서의 멀티 프로세스

현대의 웹 브라우저는 단순히 페이지를 렌더링할 뿐만 아니라 여러 개의 탭을 관리하고, 확장 프로그램을 관리/로드하는 등 여러 가지 역할을 수행한다.

웹 브라우저가 단일 프로세스 구조를 사용할 경우(초기의 웹 브라우저), 하나의 탭, 확장 프로그램 등 단일 기능에서 크래시가 발생할 경우 모든 브라우저의 기능들이 영향을 받는다는 것을 의미한다.

이러한 문제를 해결하기 위해 크롬(Chrome)에서는 아래 그림과 같이 각 탭이 별도의 프로세스로 실행되어 단일 기능에서의 크래시가 전체 브라우저에 끼치는 영향을 최소화한다.

또한, 하나의 브라우저 프로세스가 이러한 자식 프로세스들을 관리하고, 브라우저 애플리케이션의 수명주기 전체를 제어한다.

![Chrome 멀티 프로세스 모델](./electron-process-model/chrome.png)

&nbsp;

### Electron에서의 멀티 프로세스

브라우저에서의 멀티 프로세스 모델과 비슷하게, Electron에서는 `main` 프로세스와 `renderer` 프로세스라는 두 가지 프로세스로 구성된 프로세스 모델을 사용한다.

`renderer` 프로세스는 앞선 크롬의 예시에서 각 단일 탭 프로세스와 유사하며, `main` 프로세스는 애플리케이션의 수명주기를 관리하는 하나의 브라우저 프로세스와 유사하다.

&nbsp;

---

### `main` 프로세스

Electron 애플리케이션에는 하나의 `main` 프로세스가 존재한다. 이 `main` 프로세스는 Node.js 환경에서 구동된다. 따라서, 모든 Node.js API를 사용할 수 있다.

#### 윈도우(Window) 관리

`main` 프로세스의 가장 주요한 목적은 `BrowserWindow` 모듈을 통해 애플리케이션 윈도우(Window)를 만들고 관리하는 것이다.

각각의 `BrowserWindow` 인스턴스는 분리된 `renderer` 프로세스에서 웹 페이지를 로드하는 애플리케이션 윈도우를 생성한다. `main` 프로세스에서는 각 `BrowserWindow` 인스턴스의 `webContents` 프로퍼티([`Electron.WebContents` 객체](https://www.electronjs.org/docs/latest/api/web-contents))를 통해 해당 윈도우의 웹 컨텐츠와 상호 작용할 수 있다.

```js
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('https://github.com')

const contents = win.webContents
console.log(contents)
```

> `renderer` 프로세스는 `BrowserWindow` 인스턴스 뿐만 아니라 iframe, webviews, BrowserView 모듈 등의  [Web Embeds](https://www.electronjs.org/docs/latest/tutorial/web-embeds)를 위해서도 생성된다. `webContents` 프로퍼티는 이러한 Embedded Web Content에서도 사용 가능하다.

`BrowserWindow` 모듈은 [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) 이므로, 윈도우 최소화, 윈도우 최대화 등 다양한 사용자 이벤트에 이벤트 핸들러를 추가할 수 있다.

`BrowserWindow` 인스턴스가 파괴(destroyed)되면, 해당 인스턴스에 대응되는 `renderer` 프로세스도 같이 종료된다.

#### 애플리케이션 생명 주기

또한 `main` 프로세스는 `app` 모듈을 통해 Electron 애플리케이션의 생명 주기를 관리한다.

이 `app` 모듈은 프로그래밍적 방식으로 애플리케이션 종료, 애플리케이션 독(Dock) 수정, "About" 패널 표시 등 다양한 커스텀 애플리케이션 동작을 추가하는 데 필요한 다양한 이벤트와 메서드를 제공한다.

#### 네이티브 API

Electron이 단순히 웹 컨텐츠를 보여주는 Chromium Wrapper 이상의 기능을 수행하도록 하기 위해서, `main` 프로세스에서는 사용자의 운영체제와 상호작용하는 커스텀 API를 제공한다.

Electron은 메뉴, 다이얼로그(dialogs), 트레이 아이콘 등 네이티브 데스크탑 기능에 대한 [다양한 모듈](https://www.electronjs.org/docs/latest/api/app)을 사용가능하도록 노출한다.

&nbsp;

---

### `renderer` 프로세스

Electron 애플리케이션은 열려져 있는 각각의 `BrowserWindow`(및 `Web Embeds`)에 대해서 별도의 `renderer` 프로세스를 생성한다.

이름에서 알 수 있듯 `renderer` 프로세스는 웹 컨텐츠의 렌더링을 담당한다. 따라서 `renderer` 프로세스에서 동작하는 코드는 웹 표준(적어도 Chromium이 구현하는)에 따라 동작하여야 한다.

따라서, 하나의 윈도우 내의 모든 사용자 인터페이스와 기능은 웹에서 동작하는 것과 같은 도구, 패러다임으로 작성해야한다.

모든 웹 표준 명세에 대해서 설명하는 것은 해당 가이드의 범위를 벗어나지만, 이해를 돕기 위해 최소한의 요구사항을 명시하면 다음과 같다.

- Renderer 프로세스의 진입점은 단일 HTML 파일이다.
- UI 스타일은 CSS(Cascading Style Sheets)를 사용한다.
- `<script>` 태그를 통해 자바스크립트 코드를 포함할 수 있다.

또한, 이 내용은 `renderer` 프로세스는 Node.js API(`require` 등)들에 대해 직접 접근이 불가능하다는 것을 의미한다. 따라서, NPM을 이용하여 패키지를 불러오고 싶다면 `webpack` 등의 번들러를 사용하여야 한다.

> 위험: 과거에는 `renderer` 프로세스가 편의를 위해 full-node.js 환경에서 실행되는 것이 기본값이었지만, 보안상의 이유로 비활성화되었다.

그렇다면 `renderer` 프로세스의 사용자 인터페이스가 `main` 프로세스에서만 사용가능한 Node.js 및 Electron의 네이티브 데스크탑 기능과 어떻게 상호작용 할 수 있는지 궁금할 것이다. 실제로, `renderer` 프로세스에서 직접 Electorn의 기능을 가져와 사용할 방법은 없다.

&nbsp;

---

### Preload 스크립트

Preload 스크립트는 웹 컨텐츠 로딩이 시작되기 전, `renderer` 프로세스에서 실행되는 코드를 포함할 수 있다.

해당 스크립트는 `renderer` 프로세스의 컨텍스트에서 실행되지만, Node.js API에 대한 보다 더 많은 권한이 주어진다.

Preload 스크립트 지정은 `BrowserWindow` 인스턴스 생성 시 `webPreferences.preload` 옵션에서 지정할 수 있다.

```js
const { BrowserWindow } = require('electron')
// ...
const win = new BrowserWindow({
  webPreferences: {
    preload: 'path/to/preload.js'
  }
})
// ...
```

Preload 스크립트는 `renderer` 프로세스와 전역 [`Window 인터페이스`](https://developer.mozilla.org/en-US/docs/Web/API/Window)를 공유하기 때문에, `renderer` 프로세스의 웹 컨텐츠가 사용할 수 있는 `window` 전역 객체에 임의의 API를 노출시킴으로써 웹 컨텐츠의 사용가능한 기능을 확장할 수 있다.

이때, Preload 스크립트는 삽입 대상인 `renderer` 프로세스와 `window` 전역 객체를 공유하지만, `contextIsolation` 설정의 기본값 때문에 Preload 스크립트의 어떤 변수도 `window` 객체에 직접 할당할 수 없다.

```js
// preload.js
window.myAPI = {
  desktop: true
}
```

```js
// renderer.js
console.log(window.myAPI)
// => undefined
```

Context Isolation(컨텍스트 격리)는 보안상의 이유로 권한이 부여된 API가 웹 컨텐츠 코드에 유출되는 것을 피하기 위해 Preload 스크립트가 `renderer`에서 격리된다는 것을 의미한다.

대신, [`contextBridge`](https://www.electronjs.org/docs/latest/api/context-bridge) 모듈을 이용하여 이를 안전하게 수행할 수 있다.

```js
// preload.js
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true
})
```

```js
// renderer.js
console.log(window.myAPI)
// => { desktop: true }
```

이러한 기능은 많이 사용되는 다음 두 가지 목적으로 사용될 때 매우 유용하다.

- `ipcRenderer` 헬퍼를 `renderer` 프로세스에게 노출함으로써, `main` 프로세스에서 실행해야하는 기능을 수행해야 할 때 IPC(Inter-Process Communication) 요청을 가능하게 한다. (반대의 경우에도 마찬가지)
- 원격 URL에서 호스팅되는 기존 웹 앱에 대한 Electron 래퍼를 개발하는 경우 웹 클라이언트 측의 데스크톱 전용 로직에 사용할 수 있는 렌더러의 창 전역에 사용자 정의 속성을 추가할 수 있습니다. (If you're developing an Electron wrapper for an existing web app hosted on a remote URL, you can add custom properties onto the renderer's window global that can be used for desktop-only logic on the web client's side.)

&nbsp;

---

### Utility 프로세스

Electron 애플리케이션은 `main` 프로세스에서 [`UtilityProcess`](https://www.electronjs.org/docs/latest/api/utility-process) API를 사용하여 여러 개의 자식 프로세스들을 생성할 수 있다.

생성된 Utility 프로세스는 Node.js 환경에서 실행되며, 이는 모든 Node.js API를 사용할 수 있다는 것을 의미한다.

이러한 Utility 프로세스는 신뢰할 수 없는 서비스, CPU 집약적인 작업, 충돌이 발생하기 쉬운 요소 등을 별도의 프로세스에서 실행시키고자 할 때 사용할 수 있다.

Utility 프로세스와 Node.js의 `child_process` 모듈을 통해 생성된 프로세스와의 주요한 차이점은 Utility 프로세스는 [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)를 사용하여 `renderer` 프로세스와의 통신 채널을 구성할 수 있다는 점이다.

따라서, Electron 애플리케이션의 `main` 프로세스에서 자식 프로세스를 fork 해야 할 필요가 있을 경우에는 Node.js의 `child_process.fork` 보다 `UtilityProcess`를 항상 선호하여야 한다.

&nbsp;

---

### Process-specifig module aliases (TypeScript)

Electron NPM 패키지는 Electron의 type definition의 하위 집합을 포함하는 모듈 서브 패스들을 제공한다.

- `electron/main` 는 모든 `main` 프로세스 모듈에 대한 타입을 포함한다.
- `electron/renderer` 는 모든 `renderer` 프로세스 모듈에 대한 타입을 포함한다.
- `electron/common` 는 `main`, `renderer` 프로세스 모두에서 동작하는 모든 모듈에 대한 타입을 포함한다.

이러한 요소들은 런타임에 영향을 미치지 않지만, 타입 체킹이나 자동 완성을 위해 사용할 수 있다.

```js
const { app } = require('electron/main')
const { shell } = require('electron/common')
```
