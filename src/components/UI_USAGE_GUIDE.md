# PicoArt v10 - UI 컴포넌트 사용 가이드

## 📦 생성된 컴포넌트

1. **OrientalTab.jsx** - 메인 동양화 탭 컴포넌트
2. **OrientalTab.css** - 메인 스타일
3. **ArtworkCard.jsx** - 개별 작품 카드
4. **ArtworkCard.css** - 카드 스타일
5. **LoadingSkeleton.jsx** - 로딩 중 스켈레톤
6. **LoadingSkeleton.css** - 스켈레톤 스타일

---

## 🎨 기능

### 1. 서브카테고리 선택
- 🇰🇷 한국 전통화 (15개)
- 🇨🇳 중국 수묵화 (15개)
- 🇯🇵 일본 우키요에 (15개)

### 2. 작품 그리드 표시
- 반응형 레이아웃 (PC: 5개, 태블릿: 3개, 모바일: 2개)
- 호버 시 작품 정보 표시
- 클릭하여 선택

### 3. 작품 상세 모달
- 큰 이미지 표시
- 작가, 연도, 스타일 정보
- 태그, 기술 정보 (밝기, 방향, 유형)

### 4. 로딩 상태
- 스켈레톤 UI로 부드러운 로딩 경험

---

## 🚀 사용 방법

### App.js에 통합

```jsx
import React, { useState } from 'react';
import OrientalTab from './components/OrientalTab';
import artworkDatabase from './data/artwork-database.json';

function App() {
  const [selectedTab, setSelectedTab] = useState('impressionism');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleArtworkSelect = (artwork) => {
    setSelectedArtwork(artwork);
    console.log('선택된 작품:', artwork);
    // NST 처리 로직 실행
  };

  return (
    <div className="app">
      <header>
        <h1>PicoArt v10</h1>
      </header>

      {/* 탭 네비게이션 */}
      <nav className="tabs">
        <button 
          className={selectedTab === 'impressionism' ? 'active' : ''}
          onClick={() => setSelectedTab('impressionism')}
        >
          미술 사조
        </button>
        <button 
          className={selectedTab === 'masters' ? 'active' : ''}
          onClick={() => setSelectedTab('masters')}
        >
          거장
        </button>
        <button 
          className={selectedTab === 'oriental' ? 'active' : ''}
          onClick={() => setSelectedTab('oriental')}
        >
          동양화
        </button>
      </nav>

      {/* 컨텐츠 */}
      <main>
        {selectedTab === 'oriental' && (
          <OrientalTab
            artworkDatabase={artworkDatabase}
            onArtworkSelect={handleArtworkSelect}
          />
        )}
        
        {selectedTab === 'impressionism' && (
          <div>미술 사조 컴포넌트</div>
        )}
        
        {selectedTab === 'masters' && (
          <div>거장 컴포넌트</div>
        )}
      </main>
    </div>
  );
}

export default App;
```

---

## 📂 파일 구조

```
src/
├── components/
│   ├── OrientalTab.jsx
│   ├── OrientalTab.css
│   ├── ArtworkCard.jsx
│   ├── ArtworkCard.css
│   ├── LoadingSkeleton.jsx
│   └── LoadingSkeleton.css
├── data/
│   └── artwork-database.json
└── App.js
```

---

## 🎯 Props

### OrientalTab

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| artworkDatabase | Object | ✅ | 작품 데이터베이스 |
| onArtworkSelect | Function | ❌ | 작품 선택 시 콜백 |

### ArtworkCard

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| artwork | Object | ✅ | 작품 정보 객체 |
| isSelected | Boolean | ❌ | 선택 상태 |
| onClick | Function | ❌ | 클릭 핸들러 |

### LoadingSkeleton

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| count | Number | ❌ | 15 | 스켈레톤 개수 |

---

## 🎨 커스터마이징

### 색상 변경

`OrientalTab.css`에서 주요 색상 변경:

```css
/* 주 색상 (보라색 그라데이션) */
.subcategory-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 원하는 색상으로 변경 예시 */
.subcategory-btn.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}
```

### 그리드 레이아웃 조정

```css
.artworks-grid {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  /* 카드 크기 조정: 220px → 원하는 크기 */
}
```

---

## ✨ 주요 기능

### 1. 반응형 디자인
- 데스크톱: 5-6개 열
- 태블릿: 3-4개 열
- 모바일: 2개 열

### 2. 애니메이션
- 페이드인
- 호버 효과
- 모달 팝업
- 선택 표시

### 3. 접근성
- 키보드 네비게이션
- 포커스 표시
- ARIA 속성

### 4. 성능
- 이미지 lazy loading
- CSS 애니메이션 (GPU 가속)
- 최소 리렌더링

---

## 🐛 트러블슈팅

### 이미지가 안 보여요
```jsx
// public/artworks/ 경로 확인
// artwork.file 경로 확인
src={`/artworks/${artwork.file}`}
```

### 스타일이 안 먹혀요
```jsx
// CSS 파일 import 확인
import './OrientalTab.css';
```

### 클릭이 안 돼요
```jsx
// onArtworkSelect prop 전달 확인
<OrientalTab
  artworkDatabase={artworkDatabase}
  onArtworkSelect={handleArtworkSelect}
/>
```

---

## 📱 테스트 체크리스트

- [ ] 서브카테고리 버튼 클릭
- [ ] 작품 카드 호버
- [ ] 작품 카드 클릭
- [ ] 상세 모달 열기/닫기
- [ ] 반응형 (모바일/태블릿/데스크톱)
- [ ] 이미지 로딩
- [ ] 키보드 네비게이션

---

## 🎉 다음 단계

1. ✅ UI 컴포넌트 완성
2. ⬜ 이미지 45개 수집 (정우님 작업 중)
3. ⬜ 실제 프로젝트에 통합
4. ⬜ 색상 매칭 알고리즘 연결
5. ⬜ 테스트 및 버그 수정
6. ⬜ Vercel 배포

---

## 💡 팁

- 이미지는 800x600px 정도로 최적화
- 파일 크기는 60KB 이하
- 작품명은 한글/영문 모두 제공
- HSV 값은 실제 이미지 분석 후 업데이트

화이팅! 🎨
