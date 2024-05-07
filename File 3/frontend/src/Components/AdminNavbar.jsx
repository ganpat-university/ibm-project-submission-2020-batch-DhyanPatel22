import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
const items = [
  {
    label: <Link to={"/admin/emotion"}>Emotion</Link>,
    key: 'emotion',
  },
  {
    label:  <Link to={"/admin/user"}>Users</Link>,
    key: 'users',
  },
  {
    label:<Link to={"/logout"}>Logout</Link>,
    key: 'logout',
  }
 
];
const AdminNavbar = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} activeKey={
    window.location.pathname.includes('emotion') ? 'emotion' : 'users'
  } />;
};
export default AdminNavbar;