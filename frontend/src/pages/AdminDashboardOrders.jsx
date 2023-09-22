import React, { useEffect, useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import ChartComponent from "../components/Admin/ChartComponent";
import ChartComponentOrder from "../components/Admin/ChartComponentOrder";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  console.log("adminOrders", adminOrders);
  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);
  const handleStartDayChange = (e) => {
    setValStartDay(e.target.value);
  };
  const handleEndDayChange = (e) => {
    setValEndDay(e.target.value);
  };
  const handleStartDayClick = () => {
    setValEndDay("");
    setValStartDay("");
  };
  const getAllOrders = adminOrders?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) && orderDate <= new Date(valEndDay)
    );
  });
  //chart;
  const deliveredOrdersInfo = getAllOrders?.map((order) => {
    return {
      day: order.createdAt.slice(0, 10),
      totalOder: 1,
    };
  });
  console.log("deliveredOrdersInfo", deliveredOrdersInfo);
  console.log("getAllOrders", getAllOrders);

  const totalAdminOrders = getAllOrders?.length;

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
      field: "ShopName",
      headerName: "Tên của hàng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
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
      field: "createdAt",
      headerName: "Ngày đặt",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  const row1 = [];

  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total:
          item?.totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
        ShopName: item?.cart?.[0]?.shop?.name,
      });
    });
  adminOrders &&
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
        createdAt: item?.createdAt.slice(0, 10),
        ShopName: item?.cart?.[0]?.shop?.name,
      });
    });
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex  justify-center">
            <div className="w-[97%] flex flex-col justify-center">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={4}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: "30px",
                  background: "#ccc",
                }}>
                {valEndDay ? (
                  <button
                    onClick={handleStartDayClick}
                    style={{ color: "#294fff", fontSize: "20px" }}>
                    Tiếp tục thống kê
                  </button>
                ) : (
                  <></>
                )}
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
                      paddingLeft: "75%",
                    }}>
                    <span>Tổng đơn hàng: </span>
                    <span style={{ color: "#294fff" }}>{totalAdminOrders}</span>
                  </div>
                </>
              )}
              {valEndDay && (
                <ChartComponentOrder
                  arrData={
                    deliveredOrdersInfo && deliveredOrdersInfo
                  }></ChartComponentOrder>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
