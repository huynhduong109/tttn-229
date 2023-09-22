import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import "./AllOrder.css";

const AllOrders = () => {
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const clearRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);
  const handleStartDayChange = (e) => {
    setValStartDay(e.target.value);
  };
  const handleEndDayChange = (e) => {
    setValEndDay(e.target.value);
  };

  const getAllOrders = orders?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) && orderDate <= new Date(valEndDay)
    );
  });

  const totalOrders = getAllOrders?.length;

  const columns = [
    { field: "id", headerName: "Mã đơn hàng", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Tình trạng",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Tổng tiền",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  const row1 = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total:
          item.totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        status: item.status,
      });
    });
  orders &&
    getAllOrders.forEach((item) => {
      row1.push({
        id: item._id,
        itemsQty: item.cart.length,
        total:
          item.totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        status: item.status,
      });
    });

  return (
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
              Thống kê đơn hàng ----
            </h1>
            <div>
              <label>Ngày bắt đầu: </label>
              <input
                style={{ border: "1px solid black" }}
                value={valStartDay}
                ref={clearRef}
                type="date"
                onChange={handleStartDayChange}></input>
              <label style={{ marginLeft: "50px" }}>Ngày kết thúc: </label>
              <input
                style={{ border: "1px solid black" }}
                className="border border-solid border-red-500"
                type="date"
                value={valEndDay}
                ref={clearRef}
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
                <span>Tổng đơn hàng: </span>
                <span style={{ color: "#294fff" }}>{totalOrders}</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AllOrders;
