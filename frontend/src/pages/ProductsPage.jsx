import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { State } from "country-state-city";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import RangeSlider from "../components/RangeSlider/RangeSlider";
import "./ProductPage.css";

const ProductsPage = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [filteredCount, setFilteredCount] = useState(0); // Số sản phẩm sau khi lọc

  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state?.products);
  const [data, setData] = useState([]);

  const handleMinPriceChange = (value) => {
    setMinPrice(value);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
  };

  const handleProvinceChange = (selectedValue) => {
    setSelectedProvince(selectedValue);
  };

  const handleSortOptionChange = (selectedValue) => {
    setSortOption(selectedValue);
  };

  const filterProducts = () => {
    let filteredData = [...allProducts];

    if (selectedProvince) {
      filteredData = filteredData.filter(
        (product) => product?.shop?.address === selectedProvince
      );
    }

    filteredData = filteredData.filter(
      (product) =>
        product.discountPrice >= minPrice && product.discountPrice <= maxPrice
    );

    if (sortOption === "priceLowToHigh") {
      filteredData.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sortOption === "priceHighToLow") {
      filteredData.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sortOption === "popular") {
      filteredData.sort((a, b) => b.sold_out - a.sold_out);
    } else if (sortOption === "newest") {
      filteredData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setData(filteredData);
    setFilteredCount(filteredData.length); // Cập nhật số lượng sản phẩm sau khi lọc
  };

  useEffect(() => {
    if (
      categoryData === null &&
      selectedProvince === "" &&
      minPrice === 0 &&
      maxPrice === 50000000 &&
      sortOption === "default"
    ) {
      const d = allProducts;
      setData(d);
      setFilteredCount(d.length); // Số sản phẩm ban đầu
    } else if (categoryData !== null) {
      const d =
        allProducts &&
        allProducts.filter((i) => i.category === categoryData);
      setData(d);
      setFilteredCount(d.length); // Số sản phẩm sau khi lọc theo danh mục
    } else {
      filterProducts();
    }
  }, [selectedProvince, minPrice, maxPrice, sortOption]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <div className="conatainer_input_price bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="conatainer_body_price">
              <label className="conatainer_body_text">Giá thấp nhất: </label>
              <RangeSlider
                value={minPrice}
                min={0}
                max={100000000}
                onChange={handleMinPriceChange}
                className="w-full"
              />
            </div>
            <div className="conatainer_body_price">
              <label className="conatainer_body_text">Giá cao nhất: </label>
              <RangeSlider
                value={maxPrice}
                min={0}
                max={100000000}
                onChange={handleMaxPriceChange}
                className="w-full"
              />
            </div>
            <div className="conatainer_body_price">
              <label className="conatainer_body_text">Tỉnh/Thành phố: </label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                <option value="">Tất cả</option>
                {State.getStatesOfCountry("VN").map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="conatainer_body_price">
              <label className="conatainer_body_text">Sắp xếp theo: </label>
              <select
                value={sortOption}
                onChange={(e) => handleSortOptionChange(e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                <option value="default">Mặc định</option>
                <option value="priceLowToHigh">Giá thấp đến cao</option>
                <option value="priceHighToLow">Giá cao đến thấp</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

          </div>
          <div className="text-center">
            <p>
              <span >Có</span>{" "}
              <span style={{ color: 'red', fontWeight: 'bold' }}>{filteredCount}</span>{" "}
              <span >kết quả phù hợp được lọc</span>
            </p>
          </div>
          <br />
          <div className={`${styles.section}`}>

            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data.map((product, index) => (
                <ProductCard data={product} key={index} />
              ))}
            </div>
            {data.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                Không có sản phẩm nào được tìm thấy!
              </h1>
            ) : null}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
