# Cafe24 API React 프로젝트 개발 일지

## 📅 2025-11-06 작업 내용

---

## 🚀 1. Netlify 배포 가이드

### Git을 통한 자동 배포 (추천)

#### 1단계: Git 저장소 초기화
```bash
cd "C:\Users\user\Desktop\251105 cafeApiReact\cafe"
git init
git add .
git commit -m "Initial commit: Cafe React App"
git branch -M main
```

#### 2단계: GitHub 원격 저장소 연결
```bash
git remote add origin https://github.com/본인username/저장소이름.git
git push -u origin main
```

#### 3단계: Netlify 연동
1. https://app.netlify.com 접속
2. "Add new site" → "Import an existing project"
3. GitHub 연동 후 저장소 선택
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy site 클릭

**장점:** 이후 Git push 시 자동으로 배포됨

### Git Push 시 발생하는 에러 해결

#### 에러: `! [rejected] main -> main (fetch first)`

**원인:** GitHub 저장소에 이미 파일(README.md 등)이 존재

**해결방법:**
```bash
# 방법 1: 강제 푸시 (기존 내용 삭제)
git push -u origin main --force

# 방법 2: 병합 후 푸시 (기존 내용 유지)
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## ⚡ 2. Firebase Functions Axios 리팩토링

### 문제점
- 기존 `https` 모듈 사용으로 코드가 복잡함 (80줄)
- Promise 래퍼 수동 작성 필요
- 에러 처리가 번거로움

### 해결: Axios로 전환

#### Axios 설치
```bash
cd C:\Users\user\Desktop\git\sp_firebase1\cafe24api\functions
npm install axios
```

#### 코드 비교

**Before (https 모듈):**
```javascript
function refreshCafe24Token(tokenData, clientSecret) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({...}).toString();
    const options = { hostname, port, path, method, headers };
    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => { responseData += chunk; });
      res.on("end", () => { /* ... */ });
    });
    req.on("error", (error) => { /* ... */ });
    req.write(postData);
    req.end();
  });
}
```

**After (Axios):**
```javascript
async function refreshCafe24Token(tokenData, clientSecret) {
  const authString = `${tokenData.client_id}:${clientSecret}`;
  const authBase64 = Buffer.from(authString).toString("base64");

  const response = await axios.post(
    `https://${tokenData.mall_id}.cafe24api.com/api/v2/oauth/token`,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokenData.refresh_token,
    }),
    {
      headers: {
        "Authorization": `Basic ${authBase64}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data;
}
```

**개선 효과:**
- ✅ 코드 길이 70% 감소
- ✅ 가독성 대폭 향상
- ✅ 에러 처리 자동화

#### 배포
```powershell
cd C:\Users\user\Desktop\git\sp_firebase1\cafe24api
firebase deploy --only functions
```

---

## 🎨 3. Footer 토글 기능 구현

### 요구사항
- 초기 상태: 닫힘
- 버튼 클릭: 열림/닫힘 토글
- 최소한의 CSS (버튼 스타일 없음)

### 구현 코드

```html
<!-- 토글 버튼 -->
<div id="footerToggleBtn">
  Nosakorazone Corp. Business Info <span class="arrow">▼</span>
</div>

<!-- 초기에 숨겨진 콘텐츠 -->
<div class="info" id="footerContent" style="display: none;">
  <!-- 내용 -->
</div>
```

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('footerToggleBtn');
  const content = document.getElementById('footerContent');
  const arrow = btn.querySelector('.arrow');

  btn.addEventListener('click', function() {
    if (content.style.display === 'none') {
      content.style.display = 'block';
      arrow.classList.add('rotate');
    } else {
      content.style.display = 'none';
      arrow.classList.remove('rotate');
    }
  });
});
```

```css
#footerToggleBtn {
  cursor: pointer;
}

#footerToggleBtn .arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

#footerToggleBtn .arrow.rotate {
  transform: rotate(180deg);
}
```

### 영어 콘텐츠
```html
Company: Nosakorazone Corp.
CEO: Lee San Ho
Business License No.: 453-87-03589
E-Mail: corpnosacorazon@gmail.com
Address: 1001-141 Ho, Star Plaza, 410, Gimpohangang-ro, Gimpo-si...

영업시간:
Weekdays 10:00 AM - 5:00 PM
Lunch Break 12:30 PM - 1:50 PM
Closed on Saturdays, Sundays, and Public Holidays
```

---

## 🔧 4. Firebase Functions API 버그 수정

### getSalesReport 함수 에러

#### 문제 1: `endpoint is not defined`

**원인:**
```javascript
const endpointTemplate = "/api/v2/admin/reports/salesvolume";
const result = await global.callCafe24API("GET", endpoint); // ❌ endpoint 변수 없음
```

**해결:**
```javascript
const endpointTemplate = "/api/v2/admin/reports/salesvolume";
const queryString = req.url.split('?')[1] || '';
const endpoint = `${endpointTemplate}?${queryString}`; // ✅ endpoint 생성
const result = await global.callCafe24API("GET", endpoint);
```

#### 문제 2: `start_date is a required field`

**원인:** Cafe24 API가 필수 파라미터를 요구함

**해결:**
```javascript
// src/components/api.jsx
export const fetchSalesReport = async () => {
  // 📅 설정 (여기만 수정하세요!)
  const start_date = "2024-01-01";
  const end_date = "2024-12-31";
  const product_no = "16";  // 상품 번호 (필수)

  const params = new URLSearchParams({
    start_date,
    end_date,
    product_no
  });

  const response = await axios.get(
    `https://getsalesreport-l5dreh5uiq-uc.a.run.app?${params.toString()}`
  );
  return response.data;
}
```

### 유지보수 팁
날짜와 상품 번호를 직관적으로 수정 가능:
```javascript
const start_date = "2024-01-01";  // 시작 날짜
const end_date = "2024-12-31";    // 종료 날짜
const product_no = "16";          // 상품 번호
```

---

## 🎭 5. React 스켈레톤 UI 구현

### 문제점
- 전체 페이지가 로딩 완료될 때까지 흰 화면
- 사용자 경험 저하

### 해결: 개별 스켈레톤 처리

**Before:**
```javascript
if (isLoadingUsers || isLoadingSales) {
  return <div>Loading...</div>;  // 전체 로딩
}
```

**After:**
```javascript
return (
  <>
    {/* 헤더는 즉시 표시 */}
    <h1>Products</h1>

    {/* Sales Report - 스켈레톤 */}
    {isLoadingSales ? (
      <Skeleton active paragraph={{ rows: 4 }} />
    ) : (
      <div>{salesReportData}</div>
    )}

    {/* Products - 스켈레톤 */}
    {isLoadingUsers ? (
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Skeleton key={item} active avatar paragraph={{ rows: 3 }} />
        ))}
      </div>
    ) : (
      <div>{/* 상품 목록 */}</div>
    )}
  </>
);
```

### 사용자 경험 개선
- **Before:** 로딩 → 3초 대기 → 모든 콘텐츠 표시
- **After:** 레이아웃 즉시 → 스켈레톤으로 로딩 상태 표시 → 데이터 준비되는 대로 표시

---

## 📦 6. 프로젝트 구조

```
cafeapi/
├── src/
│   ├── components/
│   │   ├── api.jsx           # API 호출 함수
│   │   ├── hooks.jsx          # React Query 커스텀 훅
│   │   └── GetProducts.jsx    # 메인 컴포넌트
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🛠️ 주요 기술 스택

- **Frontend:** React 19, Vite, TailwindCSS
- **UI Library:** Ant Design
- **State Management:** TanStack React Query
- **HTTP Client:** Axios
- **Backend:** Firebase Functions
- **API:** Cafe24 Admin API
- **Deployment:** Netlify

---

## 📚 참고 명령어

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### Firebase 배포
```bash
firebase deploy --only functions
```

### Git 커밋
```bash
git add .
git commit -m "메시지"
git push
```

---

## 🐛 트러블슈팅

### 1. 흰 화면 문제
- **원인:** GetProducts.jsx에서 컴포넌트가 불완전
- **해결:** UI 컴포넌트 완성 + 스켈레톤 적용

### 2. API 422 에러
- **원인:** 필수 파라미터 누락
- **해결:** start_date, end_date, product_no 추가

### 3. Git push 거부
- **원인:** 원격 저장소에 로컬에 없는 파일 존재
- **해결:** `git push --force` 또는 `git pull --allow-unrelated-histories`

### 4. Firebase Functions endpoint 에러
- **원인:** 변수명 불일치
- **해결:** endpoint 변수 명시적 생성

---

## 💡 유지보수 가이드

### Sales Report 기간 변경
`src/components/api.jsx` 파일의 22-24번째 줄 수정:
```javascript
const start_date = "2024-01-01";  // 원하는 날짜로 변경
const end_date = "2024-12-31";
const product_no = "16";          // 원하는 상품 번호로 변경
```

### Footer 토글 버튼 텍스트 변경
```html
<div id="footerToggleBtn">
  원하는 텍스트 <span class="arrow">▼</span>
</div>
```

### 새로운 API 추가
1. `src/components/api.jsx`에 fetch 함수 추가
2. `src/components/hooks.jsx`에 커스텀 훅 추가
3. 컴포넌트에서 훅 사용

---

## ✅ 오늘의 성과

1. ✅ Netlify 배포 가이드 작성
2. ✅ Firebase Functions Axios로 리팩토링 (70% 코드 감소)
3. ✅ Footer 토글 기능 구현 (데스크탑 + 모바일)
4. ✅ getSalesReport API 버그 수정
5. ✅ React 스켈레톤 UI 적용
6. ✅ 전체적인 사용자 경험 개선

---

## 📞 Contact

- Email: corpnosacorazon@gmail.com
- GitHub: https://github.com/ghdtjdvlf

---

**Generated on 2025-11-06**
