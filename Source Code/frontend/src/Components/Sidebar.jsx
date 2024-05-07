import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming you're using React Router for navigation
import {
  UserOutlined,
  HomeOutlined,
  CameraFilled,
  BarChartOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

function getItem(label, key, icon, link, children) {
  return {
    key,
    icon,
    children,
    label,
    link
  };
}

const items = [
  getItem('User', '1', <UserOutlined />, '/profile'),
  getItem('Report', '2', <BarChartOutlined />, '/report'),
  getItem('Camera', '3', <CameraFilled />, '/dashboard'),
  getItem('Home', '4', <HomeOutlined />, '/home'),
  getItem('Logout', '5', <LogoutOutlined />, '/logout')
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  return (
    <div>
      <Layout className='min-h-screen fixed'>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical mt-32" />
          <Menu theme="dark" mode="inline">
            {items.map(item => (
              <Menu.Item key={item.key} icon={item.icon} className={location.pathname === item.link ? 'ant-menu-item-selected' : ''}>
                <a href={item.link}>{item.label}</a>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      </Layout>
    </div>
  );
}

export default Sidebar;
