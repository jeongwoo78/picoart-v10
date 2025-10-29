# 🎨 PicoArt v10

AI 기반 명화 스타일 변환 서비스

## 📊 프로젝트 개요

PicoArt v10은 사용자의 사진을 143개의 명화 스타일로 변환해주는 AI 기반 서비스입니다.

### 주요 특징

- **143개 명화 데이터베이스**
  - 서양화: 98개 (10개 카테고리)
  - 동양화: 45개 (한국 15 + 중국 15 + 일본 15)

- **AI 자동 매칭**
  - HSV 색상 분석 기반 최적 작품 추천
  - 사진의 색상, 밝기, 방향성을 고려한 지능형 매칭

- **특허 기술**
  - 10-2018-0016297
  - 10-2018-0122600

## 🛠️ 기술 스택

### Frontend
- React 18
- Vite
- CSS3 (Responsive Design)

### Backend / API
- Vercel Serverless Functions
- Hugging Face API (Stable Diffusion)

### AI/ML
- Neural Style Transfer
- HSV Color Space Analysis
- ControlNet (계획 중)

## 📁 프로젝트 구조

```
picoart-v10/
├── public/
│   └── artworks/              # 143개 명화 이미지
│       ├── 01_Greek_Roman/    (7개)
│       ├── 02_Byzantine_Islamic/ (7개)
│       ├── 03_Renaissance/    (7개)
│       ├── 04_Baroque/        (7개)
│       ├── 05_Rococo/         (7개)
│       ├── 06_Romanticism/    (7개)
│       ├── 07_Impressionism/  (7개)
│       ├── 08_Fauvism/        (7개)
│       ├── 09_Expressionism/  (7개)
│       ├── 10_Masters/        (35개)
│       └── 11_Oriental/       (45개)
├── src/
│   ├── components/            # React 컴포넌트
│   │   ├── OrientalTab.jsx
│   │   ├── ArtworkCard.jsx
│   │   └── LoadingSkeleton.jsx
│   ├── data/                  # 데이터베이스
│   │   ├── artworks-complete.json
│   │   └── oriental-artworks-database.json
│   ├── utils/                 # 유틸리티 함수
│   │   └── colorMatching.js   # AI 색상 매칭 알고리즘
│   ├── App.jsx                # 메인 앱
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── api/
│   └── style-transfer.js      # Serverless API
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## 🚀 시작하기

### 1. 설치

```bash
# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`.env.example`을 `.env`로 복사하고 Hugging Face 토큰을 설정:

```bash
cp .env.example .env
```

`.env` 파일에서:
```
HUGGING_FACE_TOKEN=your_token_here
```

Hugging Face 토큰은 https://huggingface.co/settings/tokens 에서 생성할 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 4. 빌드

```bash
npm run build
```

## 📤 배포 (Vercel)

### 1. GitHub 연동

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/jeongwoo78/picoart-v10.git
git push -u origin main
```

### 2. Vercel 배포

1. https://vercel.com 접속
2. 프로젝트 Import
3. Environment Variables 설정:
   - `HUGGING_FACE_TOKEN`: [Your Token]
4. Deploy 클릭

### 3. 자동 배포

이후 `main` 브랜치에 push하면 자동 배포됩니다.

## 🎨 사용 방법

### 기본 사용

1. **사진 업로드**: 변환하고 싶은 사진 선택
2. **스타일 선택**: 서양화/동양화 중 원하는 작품 선택
3. **변환하기**: AI가 명화 스타일로 변환
4. **다운로드**: 결과 이미지 저장

### AI 자동 매칭 (동양화)

1. 사진 업로드
2. 동양화 카테고리 선택 (한국/중국/일본)
3. "🤖 AI 자동 추천" 버튼 클릭
4. AI가 사진과 가장 잘 어울리는 작품 추천

## 🔧 주요 기능

### 색상 매칭 알고리즘

- HSV 색상 공간 분석
- 밝기 유사도 계산
- 이미지 방향성 매칭 (가로/세로)
- 휴리스틱 보너스 시스템

### 스타일 변환 파라미터

```javascript
{
  strength: 0.85,           // 변환 강도 (0.5 → 0.85로 개선)
  guidance_scale: 15,       // 가이드 스케일 (7.5 → 15로 개선)
  negative_prompt: "photo, realistic, photograph"
}
```

## 📊 데이터베이스

### 서양화 (98개)

| 카테고리 | 개수 | 시대 |
|---------|------|------|
| 그리스·로마 | 7 | BC 800 ~ AD 500 |
| 비잔틴·이슬람 | 7 | 4C ~ 15C |
| 르네상스 | 7 | 14C ~ 17C |
| 바로크 | 7 | 17C ~ 18C 초 |
| 로코코 | 7 | 18C |
| 낭만주의 | 7 | 18C 말 ~ 19C 중 |
| 인상주의 | 7 | 19C 후반 |
| 야수파 | 7 | 20C 초 |
| 표현주의 | 7 | 20C 초 ~ 중 |
| 거장 컬렉션 | 35 | 19C ~ 20C |

### 동양화 (45개)

| 카테고리 | 개수 | 특징 |
|---------|------|------|
| 중국 수묵화 | 15 | 먹의 농담, 사의화 |
| 일본 우키요에 | 15 | 목판화, 평면적 구성 |
| 한국 전통화 | 15 | 진경산수, 풍속화, 민화 |

## 🔜 향후 계획

### v10.1 (단기)
- [ ] 서양화 갤러리 UI 완성
- [ ] 카테고리별 필터링 기능
- [ ] 작품 상세 정보 모달

### v10.2 (중기)
- [ ] ControlNet 통합 (프리미엄 기능)
- [ ] 사용자 갤러리 기능
- [ ] 소셜 공유 기능

### v11.0 (장기)
- [ ] 모바일 앱 (React Native)
- [ ] 실시간 프리뷰
- [ ] 배치 프로세싱

## 💰 비용 구조

### 개발 단계 (현재)
- **비용**: $0 (Hugging Face 무료 티어)
- **제한**: 느린 처리 속도, 모델 로딩 대기

### 프리미엄 (계획)
- **ControlNet**: $0.0055/회 (~7.5원)
- **특징**: 구도 100% 유지, 최고 품질

## 📝 라이센스

이 프로젝트는 다음 특허로 보호됩니다:
- 10-2018-0016297
- 10-2018-0122600

## 👤 작성자

**정우**
- GitHub: [@jeongwoo78](https://github.com/jeongwoo78)

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 GitHub Issues를 이용해주세요.

---

**PicoArt v10** - AI가 당신의 사진을 명화로 만들어드립니다 🎨


