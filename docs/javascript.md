# JavaScript & Typescript

01. [JavaScript 주요 변천사](#01javascript-주요-변천사)
02. [웹앱의 구성요소](#02웹어플리케이션(웹앱)의-구성요소)


## 01.JavaScript 주요 변천사

년도|이름|특징
---|---|---
1995|LiveScript| 넷스케이프 (FireFox의 전신) 브라우저에 최초 탑재된 버전
1997|JavaScript Ecma|
2005|Ajax
2009|ECMAScript v5.0|Flash와 ActionScript의 전성기 이후의 업데이트 버전, 주도적인 버전
2015|ES2015|모던 자바스크립트의 시작

#### ECMAScript v5.0이 주도적인 버전이라고 불리는 이유
> 최신 자바스크립트를 지원하지 않는 브라우저들을 위해 최신 버전의 JS를 5.0으로 변환해주는 트랜스파일러(ex. TypeScript)를 사용하여 실제로 실행되는 자바스크립트이기 때문

> 실제로 개발에 사용되는 ES2015 이후의 버전도 중요 

## 02.웹어플리케이션(웹앱)의 구성요소

### 필수불가결한 구성요소
1. HTML: UI 생성
2. CSS: HTML 스타일링
3. JavaScript: HTML 조작

* * * 
### 실행 관점의 구성요소
#### 브라우저
웹앱을 실행시키는(런타임 환경을 제공하는) 역할을 하는 구성요소
> 그 외 Node.js 등 브라우저가 아닌 환경에서도 js 실행이 가능함
* * *
### CSR & SSR
> UI를 만들기 위해선 최종적으로 HTMl 필요
-> HTMl을 언제, 어디에서 만드느냐가 중요

#### CSR (Client Side Rendering)
- 자바스크립트가 실행되면서 필요한 UI를 js가 실행시키는 방식
- 브라우저에서 실행되는 JS의 실행결과로 UI(HTML)를 주도적으로 만드는 방법

#### SSR (Server Side Rendering)
- 웹서버에서 HTMl이 만들어져서 브라우저로 전송되는 방식

* * *
### 그래픽 시스템 (프로그래밍적 관점)
- HTML + CSS => 그래픽 시스템 표현 (도형, 그라데이션, 섀도우 등)
- 애니메이션, 2d, 3d 제공하는 canvas: 
  - 그래픽 시스템을 표현하기 위한 도화지(영역) 제공
  - js로 구현 가능

* * *
### 그 외 구성요소
- 미디어 파일
- Web Worker
- Web Assembly
