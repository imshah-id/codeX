import {  Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ isAuth, isAdmin }) => {
  return isAuth && isAdmin ? (<Outlet /> ): (<Navigate to='/' replace />)
};

export default AdminRoute;
