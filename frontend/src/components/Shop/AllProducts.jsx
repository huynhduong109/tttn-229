import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };
  //
  const handleStartDayChange = (e) => {
    setValStartDay(e.target.value);
  };
  const handleEndDayChange = (e) => {
    setValEndDay(e.target.value);
  };
  const getAllProducts = products?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) && orderDate <= new Date(valEndDay)
    );
  });

  const totalOrders = getAllProducts?.length;

  const columns = [
    { field: "id", headerName: "Mã sản phẩm", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Giá",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Kho",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Đã bán",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Đánh giá",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Xóa",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  const row1 = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price:
          item.discountPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });
  products &&
    getAllProducts.forEach((item) => {
      row1.push({
        id: item._id,
        name: item.name,
        price:
          item.discountPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    // <>
    //   {isLoading ? (
    //     <Loader />
    //   ) : (
    //     <div className="w-full mx-8 pt-1 mt-10 bg-white">
    //       <DataGrid
    //         rows={row}
    //         columns={columns}
    //         pageSize={10}
    //         disableSelectionOnClick
    //         autoHeight
    //       />
    //     </div>
    //   )}
    // </>
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
              background: "#ccc",
            }}>
            <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
              Thống kê sản phẩm ----
            </h1>
            <div>
              <label>Ngày bắt đầu: </label>
              <input
                style={{ border: "1px solid black" }}
                value={valStartDay}
                type="date"
                onChange={handleStartDayChange}></input>
              <label style={{ marginLeft: "50px" }}>Ngày kết thúc: </label>
              <input
                style={{ border: "1px solid black" }}
                className="border border-solid border-red-500"
                type="date"
                value={valEndDay}
                onChange={handleEndDayChange}></input>
              {/* <button onClick={handleSubmit}>Thống kê</button> */}
            </div>
          </div>

          {row1 && (
            <>
              <DataGrid
                rows={row1}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
              />
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  padding: "50px",
                  float: "right",
                }}>
                <span>Tổng sản phẩm: </span>
                <span style={{ color: "#294fff" }}>{totalOrders}</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AllProducts;