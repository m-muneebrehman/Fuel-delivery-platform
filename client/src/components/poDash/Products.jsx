import React from "react";
import { useState } from "react"
import {
  ShoppingBag,
  Package,
  Settings,
  Filter,
  ArrowDown,
  ArrowUp,
  Edit,
  Trash,
  Plus,
  Clock,
} from "lucide-react";

// Dummy data for products
const productData = [
  {
    id: 101,
    name: "Red Shirt",
    category: "Clothing",
    price: "$29.99",
    stock: 45,
    availability: true,
  },
  {
    id: 102,
    name: "Wireless Headphones",
    category: "Electronics",
    price: "$79.99",
    stock: 18,
    availability: true,
  },
  {
    id: 103,
    name: "Leather Wallet",
    category: "Accessories",
    price: "$39.99",
    stock: 0,
    availability: false,
  },
  {
    id: 104,
    name: "Stainless Steel Water Bottle",
    category: "Kitchen",
    price: "$24.99",
    stock: 32,
    availability: true,
  },
  {
    id: 105,
    name: "Notebooks (Pack of 3)",
    category: "Stationery",
    price: "$12.99",
    stock: 5,
    availability: true,
  },
  {
    id: 106,
    name: "Coffee Mug",
    category: "Kitchen",
    price: "$14.99",
    stock: 0,
    availability: false,
  },
];

function Products() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productSortConfig, setProductSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  // Sorting function for products
  const sortedProducts = [...productData].sort((a, b) => {
    if (a[productSortConfig.key] < b[productSortConfig.key]) {
      return productSortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[productSortConfig.key] > b[productSortConfig.key]) {
      return productSortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Sorting handler for products
  const requestProductSort = (key) => {
    let direction = "asc";
    if (
      productSortConfig.key === key &&
      productSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setProductSortConfig({ key, direction });
  };

  const SortIcon = ({ column, currentSortConfig }) => {
    if (currentSortConfig.key !== column) {
      return null;
    }
    return currentSortConfig.direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <div>
      {/* Products Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 flex items-center">
            <Package className="mr-2 text-blue-500" size={24} />
            Products
          </h2>
        </div>

        {/* Add Product Form */}
        {showAddProduct && (
          <div className="bg-white p-6 mb-6 rounded-xl shadow-lg border-l-4 border-red-500">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Plus size={16} className="mr-2 text-red-600" />
              Add New Product
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 shadow-sm"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 shadow-sm">
                  <option value="">Select a category</option>
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="accessories">Accessories</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="stationery">Stationery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 shadow-sm"
                  placeholder="$0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 shadow-sm"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-4 w-4"
                    defaultChecked
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Available for sale
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition duration-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200">
                Save Product
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-900">
              <thead className="bg-blue-50 dark:bg-blue-900/60">
                <tr>
                  <th
                    onClick={() => requestProductSort("id")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/80 transition duration-200"
                  >
                    <div className="flex items-center">
                      ID
                      <SortIcon
                        column="id"
                        currentSortConfig={productSortConfig}
                      />
                    </div>
                  </th>
                  <th
                    onClick={() => requestProductSort("name")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/80 transition duration-200"
                  >
                    <div className="flex items-center">
                      Product
                      <SortIcon
                        column="name"
                        currentSortConfig={productSortConfig}
                      />
                    </div>
                  </th>
                  <th
                    onClick={() => requestProductSort("category")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/80 transition duration-200 hidden md:table-cell"
                  >
                    <div className="flex items-center">
                      Category
                      <SortIcon
                        column="category"
                        currentSortConfig={productSortConfig}
                      />
                    </div>
                  </th>
                  <th
                    onClick={() => requestProductSort("price")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/80 transition duration-200"
                  >
                    <div className="flex items-center">
                      Price
                      <SortIcon
                        column="price"
                        currentSortConfig={productSortConfig}
                      />
                    </div>
                  </th>
                  <th
                    onClick={() => requestProductSort("stock")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/80 transition duration-200 hidden sm:table-cell"
                  >
                    <div className="flex items-center">
                      Stock
                      <SortIcon
                        column="stock"
                        currentSortConfig={productSortConfig}
                      />
                    </div>
                  </th>
                  <th
                    onClick={() => requestProductSort("availability")}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/80 transition duration-200"
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon
                        column="availability"
                        currentSortConfig={productSortConfig}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-blue-100 dark:divide-blue-900">
                {sortedProducts.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-blue-50 dark:hover:bg-blue-900/40 transition duration-150 ${
                      idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-blue-50/40 dark:bg-blue-900/30"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 hidden md:table-cell">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 hidden sm:table-cell">
                      {product.stock === 0 ? (
                        <span className="text-red-500 font-medium">
                          Out of stock
                        </span>
                      ) : product.stock < 10 ? (
                        <span className="text-yellow-500 font-medium">
                          {product.stock} left
                        </span>
                      ) : (
                        <span>{product.stock}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.availability ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-500 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 mr-3 transition duration-200">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition duration-200">
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/60 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-t border-blue-100 dark:border-blue-900">
            Showing {productData.length} products
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
