// src/api.js
import axios from "axios";

// 1. 공통 axios 인스턴스 생성 (선택사항이지만 권장)
// const apiClient = axios.create({
//   baseURL: "https://your-api-base-url.com",
// });

// 2. API 함수들 정의
export const fetchProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // 테스트용 지연
  const response = await axios.get(
    "https://getproducts-l5dreh5uiq-uc.a.run.app"
  );
  return response.data;
};

export const fetchSalesReport = async () => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // 테스트용 지연

  // 📅 설정 (여기만 수정하세요!)
  const start_date = "2025-11-01";
  const end_date = "2025-11-06";
  const product_no = "14";  // 상품 번호 (필수)
  // const variants_code = "P0000BKE000A";  // 또는 상품 코드 사용

  // URL 파라미터 생성
  const params = new URLSearchParams({
    start_date,
    end_date,
    product_no
  });

  // API 호출
  const response = await axios.get(
    `https://getsalesreport-l5dreh5uiq-uc.a.run.app?${params.toString()}`
  );
  return response.data;
}

// [미래] 새로운 API가 추가되면 여기에 함수를 추가합니다.
// export const fetchOrders = async () => { ... }