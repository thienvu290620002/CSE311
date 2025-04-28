// src/components/ProductCard.js

import React from "react";

const ProductCard = ({ product }) => {
  return (
    <li key={product.id} className="mt-6 text-center group relative">
      <a href="/product-detail">
        {product.outOfStock && (
          <span className="absolute py-1 text-xs px-2 top-3 left-3 bg-black text-white rounded-xl">
            Out of stock
          </span>
        )}
        {product.discount && (
          <span className="absolute py-1 text-xs px-2 top-3 left-3 bg-red-600 text-white rounded-xl">
            {product.discount}
          </span>
        )}
        <div className="rounded-xl overflow-hidden bg-white lg:h-[385px]">
          {/* Thay thế next/image bằng thẻ <img> */}
          <img
            className="object-cover w-full h-full"
            src={product.image}
            alt={product.name}
          />
        </div>
        <h3 className="text-lg mt-2 font-semibold">{product.name}</h3>
        <div className="mt-2 relative h-5 overflow-hidden">
          <div className="flex items-center justify-center font-bold text-lg">
            {product.oldPrice && (
              <span className="line-through text-gray-500 mr-2">
                {product.oldPrice}
              </span>
            )}
            <span className="text-red-600">{product.price}</span>
          </div>
        </div>
      </a>
    </li>
  );
};

export default ProductCard;
