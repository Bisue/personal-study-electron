# Electron 공부

> 개인적으로 [Electron 공식문서](https://www.electronjs.org/docs), [Electron Forge 공식문서](https://www.electronforge.io/)를 참고하여 공부한 내용과 코드.

&nbsp;

## 설치 및 실행

### Electron Forge 스크립트

```bash
npm run start # 개발 실행 (Hot Reload 지원)
npm run package # 앱 패키징 (배포용 설치프로그램 X)
npm run make # 앱 설치프로그램 생성 (배포용)
# npm run publish # 앱 배포 Provider에 배포
```

### 기타 스크립트

```bash
npm run lint # eslint linting 실행
npm run format # prettier 실행
```

&nbsp;

## 내용 정리

### 프로젝트 초기 설정 관련

#### 1. Electron Forge 프로젝트 생성

[Built In Templates](https://www.electronforge.io/templates/vite)

```bash
# webpack (w/typescript)
npm init electron-app@latest my-new-app -- --template=webpack-typescript

# vite (w/typescript)
npm init electron-app@latest my-new-app -- --template=vite-typescript

# webpack
npm init electron-app@latest my-new-app -- --template=webpack

# vite
npm init electron-app@latest my-new-app -- --template=vite
```

#### 2. React(w/typescript) 구성

[React with TypeScript](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

1. `tsconfig.json` compilerOptions.jsx 설정

    ```json
    {
        "compilerOptions": {
            "jsx": "react-jsx",
        }
    }
    ```

2. `react`, `react-dom` 및 대응 `@types/` 설치

    ```bash
    npm install --save react react-dom
    npm install --save-dev @types/react @types/react-dom
    ```

3. React 렌더링

    ```tsx
    // src/React.tsx
    import { createRoot } from 'react-dom/client';

    const root = createRoot(document.body);
    root.render(<h2>Hello from React!</h2>);
    ```

    ```tsx
    // src/renderer.ts
    import './React';
    ```

#### 3. React Router 구성

1. `react-router-dom` 설치

    ```bash
    npm install react-router-dom
    ```

2. 기본 React Router 구조 구성

    디렉토리는 개인 선호에 따라 구성

    > 여기서는 페이지는 `src/pages`, 컴포넌트는 `src/components`

    ```tsx
    // src/React.tsx
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import App from './App';

    const root = createRoot(document.body);
    root.render(
        <React.StrictMode>
            <App></App >
        </React.StrictMode>
    );
    ```

    ```tsx
    // src/App.tsx
    import React from "react"
    import { HashRouter, Link, Route, Routes } from "react-router-dom"
    import Header from "./components/Header"
    import Index from "./pages/Index"
    import About from "./pages/About"
    import NotFound from "./pages/NotFound"

    export default function App() {
        return (
            <HashRouter>
                <Header></Header>
                <Routes>
                    <Route path="/" Component={Index}></Route>
                    <Route path="/about" Component={About}></Route>
                    <Route path="/*" Component={NotFound}></Route>
                </Routes>
            </HashRouter>
        )
    }
    ```

    ```tsx
    // src/pages/Index.tsx
    import React from "react"
    import { Link } from "react-router-dom"

    export default function Index() {
        return (
            <div>
                <h1>Index Page</h1>
                <Link to="/about">About</Link>
            </div>
        )
    }
    ```

    ```tsx
    // src/pages/About.tsx
    import React from "react"
    import { Link } from "react-router-dom"

    export default function About() {
        return (
            <div>
                <h1>About Page</h1>
                <Link to="/">Index</Link>
            </div>
        )
    }
    ```

    ```tsx
    // src/pages/NotFound.tsx
    import React from "react"
    import { Link } from "react-router-dom"

    export default function NotFound() {
        return (
            <div>
                <h1>Page Not Found</h1>
                <Link to="/">Home</Link>
            </div>
        )
    }
    ```

    ```tsx
    // src/components/Header.tsx
    import { Link } from "react-router-dom";

    export default function Header() {
        const links = [
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Error", path: "/not-exists" }
        ]

        return (
            <header className="flex items-center bg-slate-500 text-white">
                <Link to="/" className="text-lg font-bold px-4 py-2 transition-colors hover:text-blue-200">Home</Link>
                <div className="flex items-center gap-2">
                    {links.map(link => (
                        <Link key={link.name} to={link.path} className="text-sm py-2 px-2 transition-colors hover:text-blue-200">{link.name}</Link>
                    ))}
                </div>
            </header >
        )
    }
    ```
#### 4. Prettier 구성

1. `prettier`, `eslint-config-prettier` 설치

    ```bash
    npm install --save-dev prettier eslint-config-prettier
    ```

2. eslint 설정에 `eslint-config-prettier` 적용

    ```json
    // .eslintrc.json
    {
    "extends": [
        // other configs..
        "prettier" // 가장 마지막에 추가
    ],
    }
    ```

3. Prettier 설정(`.prettierrc`) 추가

    Prettier 설정은 개인 취향에 맞게

    ```json
    // .prettierrc
    {
    "semi": true,
    "singleQuote": true,
    "printWidth": 160,
    "tabWidth": 2,
    "trailingComma": "es5",
    "arrowParens": "avoid"
    }
    ```

4. `format` 스크립트 추가

    ```json
    {
    "scripts": {
        "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\""
    },
    }
    ```
