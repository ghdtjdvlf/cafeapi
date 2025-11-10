import React, { useState } from "react";
import { Modal, Skeleton } from "antd";
import { useProducts, useSalesReport } from "./hooks";

function Users() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCancel = () => {
    setSelectedProduct(null);
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

  return (
    <>
      <Modal
        open={!!selectedProduct}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {selectedProduct && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.product_name}</h2>
            <p>Product img: <img src={selectedProduct.detail_image} alt="" /></p>
            <p>Product No: {selectedProduct.product_no}</p>
            <p>Price: {selectedProduct.price || 'N/A'}</p>
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
        </div>
      </div>
    </>
  );
}

export default Users;
