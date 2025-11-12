import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import { useReview } from './hooks';

// 별점 표시를 위한 헬퍼 컴포넌트
const StarRating = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={starValue <= rating ? "text-yellow-500" : "text-gray-300"}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

// 제품 정보를 가져오는 hook
const useProduct = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://getproducts-l5dreh5uiq-uc.a.run.app')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, error };
};

function GetReview({ onReviewClick }) {
  const {
    data: reviewData,
    isLoading: isLoadingReview,
    error: errorReview
  } = useReview();

  const {
    data: productData,
    isLoading: isLoadingProduct,
    error: errorProduct
  } = useProduct();

  const [visibleReviews, setVisibleReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1); // -1부터 시작 (로딩 상태)
  const [isShowingLoader, setIsShowingLoader] = useState(true);
  const [showViewAllButton, setShowViewAllButton] = useState(false);
  const MAX_REVIEWS = 5; // 최대 5개만 표시

  // 리뷰를 하나씩 순차적으로 표시
  useEffect(() => {
    if (!reviewData?.articles || reviewData.articles.length === 0) return;

    // 첫 로딩
    const initialTimeout = setTimeout(() => {
      setIsShowingLoader(false);
      setCurrentIndex(0);
    }, 2000);

    return () => clearTimeout(initialTimeout);
  }, [reviewData]);

  useEffect(() => {
    if (currentIndex < 0 || !reviewData?.articles) return;

    // 5개 도달하면 버튼 표시하고 중단
    if (currentIndex >= Math.min(MAX_REVIEWS, reviewData.articles.length) - 1) {
      setTimeout(() => {
        setShowViewAllButton(true);
      }, 1000);
      return;
    }

    const interval = setInterval(() => {
      setIsShowingLoader(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setIsShowingLoader(false);
      }, 800); // 0.8초 로딩 후 새 리뷰 표시
    }, 3500); // 3.5초마다 (0.8초 로딩 + 2.7초 표시)

    return () => clearInterval(interval);
  }, [currentIndex, reviewData]);

  // 현재 인덱스까지의 리뷰만 표시 (최대 3개)
  useEffect(() => {
    if (reviewData?.articles && currentIndex >= 0) {
      const startIndex = Math.max(0, currentIndex - 2);
      setVisibleReviews(reviewData.articles.slice(startIndex, currentIndex + 1));
    }
  }, [currentIndex, reviewData]);

  // 이미지 추출 헬퍼 함수 - 이미지가 없으면 제품 이미지 사용
  const extractFirstImage = (htmlContent) => {
    const productImage = productData?.products?.[0]?.detail_image || null;

    if (!htmlContent) return productImage;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const img = tempDiv.querySelector('img');

    // 이미지가 없으면 제품 이미지 사용
    return img?.src || productImage;
  };

  return (
    <div className="my-8">
      <h2 className="text-[20px] md:text-[25px] lg:text-[30px] mb-4 text-center">리뷰</h2>

      {isLoadingReview ? (
        <div className="text-center text-gray-500 mt-8">
          리뷰를 불러오는 중...
        </div>
      ) : errorReview ? (
        <div className="text-center text-red-500 mt-8">
          <h2 className="text-2xl font-bold">Error Loading Reviews</h2>
          <p>{errorReview.message}</p>
        </div>
      ) : (
        <>
          {/* 팝업 카드 컨테이너 - 왼쪽 하단에 고정 */}
          <div className="fixed left-4 bottom-4 z-50 max-w-md w-96">
            <div className="flex flex-col-reverse gap-3">
              {/* 로딩 애니메이션 - 채팅 스타일 */}
              {isShowingLoader && (
                <div className="flex items-end gap-3 animate-slide-up">
                  {/* 프로필 이미지 - 다음에 표시될 리뷰의 첫 번째 이미지 */}
                  <div className="flex-shrink-0">
                    {(() => {
                      const nextReview = reviewData?.articles?.[currentIndex + 1];
                      const nextThumbnail = nextReview ? extractFirstImage(nextReview.content) : null;

                      return nextThumbnail ? (
                        <img
                          src={nextThumbnail}
                          alt="next review profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold"></div>
                      );
                    })()}
                  </div>
                  {/* 로딩 말풍선 */}
                  <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 리뷰 카드들 - 채팅 스타일로 위로 쌓임 */}
              {visibleReviews.slice().reverse().map((review, index) => {
                const thumbnail = extractFirstImage(review.content);
                const position = index; // 0: 최신(맨 아래), 1: 두번째, 2: 세번째(맨 위)
                const isOldest = position === 2; // 세번째 (제일 오래된)

                // 위치별 스타일
                let bgColor = 'bg-white';
                let textOpacity = 'opacity-100';

                if (position === 0) {
                  // 첫번째 (최신): 밝은 흰색
                  bgColor = 'bg-white';
                  textOpacity = 'opacity-100';
                } else {
                  // 두번째, 세번째: 어두운 회색
                  bgColor = 'bg-gray-100';
                  textOpacity = 'opacity-70';
                }

                return (
                  <div
                    key={review.article_no}
                    className={`flex items-start gap-3 ${textOpacity}`}
                    style={{ transition: 'opacity 0.3s ease-out, transform 0.3s ease-out' }}
                    onClick={() => onReviewClick && onReviewClick(review)}
                  >
                    {/* 프로필 이미지 - 리뷰의 첫 번째 이미지 사용 */}
                    <div className={`flex-shrink-0 ${position === 0 ? 'animate-profile-pop' : ''}`}>
                      <img
                        src={thumbnail || 'https://via.placeholder.com/40'}
                        alt="review profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>

                    {/* 말풍선 콘텐츠 */}
                    <div className={`flex-1 ${bgColor} rounded-2xl rounded-bl-sm shadow-lg hover:shadow-xl cursor-pointer border border-gray-200 ${isOldest ? 'animate-fade-out' : position === 0 ? 'animate-bubble-slide-expand' : ''}`} style={{ overflow: 'hidden' }}>
                      <div className={`p-4 ${position === 0 ? 'animate-content-reveal' : ''}`}>
                        {/* 상단: 별점 + 작성자 */}
                        <div className="flex items-center justify-between mb-2">
                          <StarRating rating={review.rating} />
                          <span className="text-xs text-gray-400">
                            {review.writer?.substring(0, 2)}****
                          </span>
                        </div>

                        {/* 제목 */}
                        <h4 className="font-semibold text-sm mb-2 line-clamp-1 text-gray-900">
                          {review.title}
                        </h4>

                        {/* 내용 */}
                        <div
                          className="text-xs text-gray-600 line-clamp-2 mb-2 [&_img]:hidden [&_p]:m-0"
                          dangerouslySetInnerHTML={{ __html: review.content }}
                        />

                        {/* 하단: 조회수 + 날짜 */}
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-200">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {review.hit}
                          </span>
                          <span>{new Date(review.created_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 전체 리뷰 보기 버튼 */}
              {showViewAllButton && reviewData?.articles && (
                <div className="flex items-end gap-3 animate-slide-up">
                  {/* 프로필 이미지 자리 (투명) */}
                  <div className="w-10 h-10 flex-shrink-0"></div>

                  {/* 버튼 */}
                  <div className="flex-1">
                    <button
                      onClick={() => {
                        // 전체 리뷰 페이지로 이동 또는 모달 열기
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span className="font-semibold">
                          총 {reviewData.articles.length}개의 리뷰가 있어요
                        </span>
                      </div>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 숨겨진 전체 리뷰 (SEO용) */}
          <div className="hidden">
            {reviewData?.articles?.map((review) => (
              <div key={review.article_no}>{review.title}</div>
            ))}
          </div>

          {(!reviewData?.articles || reviewData.articles.length === 0) && (
            <div className="text-center text-gray-500 mt-8">
              No reviews found
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GetReview;
