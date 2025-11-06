// src/hooks.js
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchSalesReport } from "./api"; // 1단계에서 만든 API 함수 임포트

/**
 * 상품 목록을 가져오는 커스텀 훅
 */
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"], // 쿼리 키 (이 훅의 고유 이름)
    queryFn: fetchProducts, // API 함수
  });
};

/**
 * 판매 보고서를 가져오는 커스텀 훅
 */
export const useSalesReport = () => {
  return useQuery({
    queryKey: ["salesReport"],
    queryFn: fetchSalesReport,
  });
};

// [미래] 새로운 API 훅이 필요하면 여기에 추가합니다.
// export const useOrders = () => { ... }
