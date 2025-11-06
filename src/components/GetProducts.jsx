import React from "react";
import axios from "axios";
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Modal, Skeleton } from "antd";

/**
 * Apple 스타일 스켈레톤 카드 컴포넌트
 */
const ProductCardSkeleton = () => (
  <div className="group">
    <div className="bg-white rounded-3xl p-6 apple-shadow">
      {/* 이미지 스켈레톤 */}
      <div className="relative overflow-hidden w-full h-72 bg-gray-100 rounded-2xl mb-6">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>

      {/* 상품명 스켈레톤 */}
      <div className="relative overflow-hidden h-7 bg-gray-100 rounded-lg mb-3 w-3/4">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>

      {/* 가격 스켈레톤 */}
      <div className="relative overflow-hidden h-8 bg-gray-100 rounded-lg mb-6 w-1/2">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>

      {/* 버튼 스켈레톤 */}
      <div className="relative overflow-hidden h-12 bg-gray-100 rounded-full">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>
    </div>
  </div>
);

/**
 * Apple 스타일 상품 카드 컴포넌트
 */
const ProductCard = ({ product, showModal }) => (
<div className="group"> 
    <div className="bg-white rounded-3xl p-6 apple-shadow hover:apple-shadow-hover transition-all duration-500 ease-out transform hover:-translate-y-2">
      {/* 이미지 컨테이너 */}
      <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.detail_image}
          alt={product.product_name}
          className="w-full h-72 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src="https://placehold.co/600x400/f3f4f6/9ca3af?text=Image+Not+Found";
          }}
        />
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* 상품 정보 */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-xl text-gray-900 truncate tracking-tight" title={product.product_name}>
          {product.product_name}
        </h3>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">
          ₩{product.price.toLocaleString()}
        </p>
      </div>

      {/* Apple 스타일 버튼 */}
      <button
        onClick={() => showModal(product)}
        className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
      >
        상세보기
      </button>
    </div>
  </div>
);

// 상품 데이터를 API로부터 가져오는 비동기 함수
const fetchUsers = async () => {
  // 스켈레톤 UI를 확인하기 위해 의도적으로 1.5초 지연 (테스트용)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const response = await axios.get(
    "https://getproducts-l5dreh5uiq-uc.a.run.app"
  );
  return response.data;
};

// 메인 Users 컴포넌트
function Users() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCancel = () => {
    setSelectedProduct(null);
  };

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <div className="pt-20 pb-16 px-8 text-center">
          <div className="relative overflow-hidden h-20 bg-gray-100 rounded-2xl mb-4 w-96 mx-auto">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="relative overflow-hidden h-8 bg-gray-100 rounded-xl w-64 mx-auto">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-12 apple-shadow max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">에러 발생</h3>
          <p className="text-gray-600 leading-relaxed">
            데이터를 불러오는 중 오류가 발생했습니다.
            <br />
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  // 데이터 로딩 성공
  return (
    <>
      {/* Apple 스타일 모달 */}
      <Modal
        open={!!selectedProduct}
        onCancel={handleCancel}
        footer={null}
        centered
        width={800}
        className="apple-modal"
        closeIcon={
          <div className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        }
      >
        {selectedProduct && (
          <div className="p-2">
            <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={selectedProduct.detail_image}
                alt={selectedProduct.product_name}
                className="w-full h-auto max-h-[60vh] object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src="https://placehold.co/600x400/f3f4f6/9ca3af?text=Image+Not+Found";
                }}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              {selectedProduct.product_name}
            </h2>
            <p className="text-4xl font-bold text-blue-600 mb-8 tracking-tight">
              ₩{selectedProduct.price.toLocaleString()}
            </p>
            <button
              onClick={handleCancel}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              닫기
            </button>
          </div>
        )}
      </Modal>

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Hero Section - Apple 스타일 */}
        <div className="pt-20 pb-16 px-8 text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight leading-none">
            Products
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 font-medium tracking-tight">
            최고의 제품을 만나보세요
          </p>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {users?.products?.map((product) => (
              <ProductCard
                key={product.product_no}
                product={product}
                showModal={showModal}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;