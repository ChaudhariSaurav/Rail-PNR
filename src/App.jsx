import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import PNRStatus from "./components/PNRStatus";
import LiveRunningStatus from "./components/LiveRunningStatus";
import "./App.css";

const { Header, Content } = Layout;

const App = () => (
  <Router>
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/">PNR Status</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/live-running-status">Live Running Status</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<PNRStatus />} />
            <Route
              path="/live-running-status"
              element={<LiveRunningStatus />}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </Router>
);

export default App;
