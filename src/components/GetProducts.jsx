import React, { useState } from "react";
import { Modal, Skeleton } from "antd";
import { useProducts, useSalesReport, useReview } from "./hooks";
import GetReview from "./GetReview";

function Users() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'views'

  const showModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCancel = () => {
    setSelectedProduct(null);
  };

  // 이미지 추출 헬퍼 함수
  const extractFirstImage = (htmlContent) => {
    if (!htmlContent) return null;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const img = tempDiv.querySelector('img');
    return img ? img.src : null;
  };

  // 스와이프 관련 함수
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (selectedProduct?.title) {
      const sortedReviews = getSortedReviews();
      const currentIndex = sortedReviews.findIndex(
        r => r.article_no === selectedProduct.article_no
      );

      if (isLeftSwipe && currentIndex < sortedReviews.length - 1) {
        // 다음 리뷰
        setSelectedProduct(sortedReviews[currentIndex + 1]);
      } else if (isRightSwipe && currentIndex > 0) {
        // 이전 리뷰
        setSelectedProduct(sortedReviews[currentIndex - 1]);
      }
    }
  };

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: errorUsers
  } = useProducts();

  const {
    data: salesReportData,
    isLoading: isLoadingSales,
    error: errorSales
  } = useSalesReport();

  const {
    data: reviewData,
    isLoading: isLoadingReview,
    error: errorReview
  } = useReview();

  // 리뷰 정렬 함수
  const getSortedReviews = () => {
    if (!reviewData?.articles) return [];

    const reviews = [...reviewData.articles];

    if (sortOrder === 'latest') {
      // 최신순 (created_date 기준 내림차순)
      return reviews.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortOrder === 'views') {
      // 조회순 (hit 기준 내림차순)
      return reviews.sort((a, b) => b.hit - a.hit);
    }

    return reviews;
  };

  return (
    <>
      <Modal
        open={!!selectedProduct}
        onCancel={handleCancel}
        footer={null}
        width="100%"
        style={{ maxWidth: '1100px', top: 20 }}
        bodyStyle={{ padding: 0, maxHeight: '85vh', overflow: 'hidden' }}
      >
        {selectedProduct && (
          <div
            className="flex flex-col md:flex-row h-[85vh]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* 왼쪽: 메인 콘텐츠 */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto relative">
              {/* 스와이프 인디케이터 & 네비게이션 버튼 (리뷰일 때만) */}
              {selectedProduct.title && (() => {
                const sortedReviews = getSortedReviews();
                const currentIndex = sortedReviews.findIndex(r => r.article_no === selectedProduct.article_no);
                const hasPrev = currentIndex > 0;
                const hasNext = currentIndex < sortedReviews.length - 1;

                return (
                  <>
                    {/* 인디케이터 */}
                    <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full z-10">
                      {currentIndex + 1} / {sortedReviews.length}
                    </div>

                    {/* 이전 버튼 */}
                    {hasPrev && (
                      <button
                        onClick={() => setSelectedProduct(sortedReviews[currentIndex - 1])}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    {/* 다음 버튼 */}
                    {hasNext && (
                      <button
                        onClick={() => setSelectedProduct(sortedReviews[currentIndex + 1])}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </>
                );
              })()}
              {/* 상품 상세 */}
              {selectedProduct.product_name && (
                <>
                  <h2 className="text-2xl font-bold mb-4">{selectedProduct.product_name}</h2>
                  <img src={selectedProduct.detail_image} alt="" className="w-full rounded-lg mb-4" />
                  <p className="text-gray-600 mb-2">상품 번호: {selectedProduct.product_no}</p>
                  <p className="text-xl font-semibold text-blue-600">가격: {selectedProduct.price || 'N/A'}원</p>
                </>
              )}

              {/* 리뷰 상세 */}
              {selectedProduct.title && (
                <>
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold mb-2">{selectedProduct.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>작성자: {selectedProduct.writer}</span>
                      <span>별점: {'⭐'.repeat(selectedProduct.rating)}</span>
                      <span>조회수: {selectedProduct.hit}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(selectedProduct.created_date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div
                    className="prose max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4"
                    dangerouslySetInnerHTML={{ __html: selectedProduct.content }}
                  />
                </>
              )}
            </div>

            {/* 오른쪽: 다른 리뷰 목록 (리뷰 상세일 때만 표시) */}
            {selectedProduct.title && (
              <div className="w-full md:w-80 bg-gray-50 border-t md:border-t-0 md:border-l overflow-y-auto p-4 max-h-[40vh] md:max-h-full">
                <div className="sticky top-0 bg-gray-50 pb-2 mb-3 md:mb-4 z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base md:text-lg font-bold">다른 리뷰</h3>
                  </div>
                  {/* 정렬 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortOrder('latest')}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                        sortOrder === 'latest'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      최신순
                    </button>
                    <button
                      onClick={() => setSortOrder('views')}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                        sortOrder === 'views'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      조회순
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {getSortedReviews()
                    ?.filter(review => review.article_no !== selectedProduct.article_no)
                    ?.map((review) => {
                      const thumbnail = extractFirstImage(review.content);
                      return (
                        <div
                          key={review.article_no}
                          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                          onClick={() => setSelectedProduct(review)}
                        >
                          <div className="flex gap-2 md:gap-3">
                            {/* 썸네일 이미지 (있을 경우만) */}
                            {thumbnail && (
                              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded overflow-hidden">
                                <img
                                  src={thumbnail}
                                  alt="review thumbnail"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* 리뷰 내용 */}
                            <div className="flex-1 p-2 md:p-3 min-w-0">
                              <div className="flex items-center gap-1 md:gap-2 mb-1">
                                <span className="text-[10px] md:text-xs text-yellow-500">
                                  {'⭐'.repeat(review.rating)}
                                </span>
                                <span className="text-[10px] md:text-xs text-gray-400 truncate">
                                  {review.writer?.substring(0, 2)}****
                                </span>
                              </div>
                              <h4 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">
                                {review.title}
                              </h4>
                              <div
                                className="text-[10px] md:text-xs text-gray-600 line-clamp-2 [&_img]:hidden [&_p]:m-0"
                                dangerouslySetInnerHTML={{ __html: review.content }}
                              />
                              <div className="flex justify-between items-center mt-1 text-[10px] md:text-xs text-gray-400">
                                <span>조회 {review.hit}</span>
                                <span className="truncate ml-1">
                                  {new Date(review.created_date).toLocaleDateString('ko-KR', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* 헤더는 항상 바로 표시 */}
          <h1 className="text-4xl font-bold mb-8 text-center">Products</h1>

          {/* Sales Report Section - 로딩 중이면 스켈레톤 */}
          {isLoadingSales ? (
            <div className="mb-8 p-4 bg-white rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Sales Report</h2>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : errorSales ? (
            <div className="mb-8 p-4 bg-white rounded shadow border-red-300 border">
              <h2 className="text-2xl font-bold mb-4 text-red-500">Sales Report Error</h2>
              <p className="text-red-500">{errorSales.message}</p>
            </div>
          ) : salesReportData ? (
            <div className="mb-8 p-4 bg-white rounded shadow">
              <h2 className="text-2xl font-bold mb-4">총 매출</h2>
              <pre className="text-sm">{JSON.stringify(salesReportData, null, 2)}</pre>
            </div>
          ) : null}

          <h1 className="text-4xl font-bold mb-8 text-center">Review</h1>



          {/* Products Grid - 로딩 중이면 스켈레톤 */}
          <h2 className="text-[20px] md:text-[25px] lg:text-[30px] mb-4 text-center">제품 리스트</h2>

          {isLoadingUsers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md p-6">
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </div>
              ))}
            </div>
          ) : errorUsers ? (
            <div className="text-center text-red-500 mt-8">
              <h2 className="text-2xl font-bold">Error Loading Products</h2>
              <p>{errorUsers.message}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersData?.products?.map((product) => (
                  <div
                    key={product.product_no}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => showModal(product)}
                  >
                    <h3 className="text-xl font-semibold my-5 ">{product.product_name}</h3>
                    <img src={product.detail_image} className="h-60 w-full object-cover border-8" alt="" />
                    <p className="text-[20px] py-5 mb-0!">상품 설명 : {product.summary_description}</p>
                    <p className="text-gray-600">Product No: {product.product_no}</p>
                    <p className="text-gray-600">Price: {product.price || 'N/A'}</p>
                  </div>
                ))}
              </div>

              {(!usersData?.products || usersData.products.length === 0) && (
                <div className="text-center text-gray-500 mt-8">
                  No products found
                </div>
              )}
            </>
          )}

          <GetReview onReviewClick={showModal} />
        </div>
      </div>
    </>
  );
}

export default Users;
