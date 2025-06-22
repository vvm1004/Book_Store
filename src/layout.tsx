import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useState } from "react";

function Layout() {

  return (
    <div>
      <AppHeader />
      <Outlet  />
    </div>
  );
}

export default Layout;