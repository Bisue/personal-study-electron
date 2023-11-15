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

### [프로젝트 설정 관련](./docs/project-setup.md)
### [Electron 프로세스 모델](./docs/electron-process-model.md)
