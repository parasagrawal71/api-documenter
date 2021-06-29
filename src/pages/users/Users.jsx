import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// IMPORT USER-DEFINED COMPONENTS HERE
import HeaderComponent from "components/header/Header";
import apiService from "apis/apiService";
import { user } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./Users.module.scss";

const Users = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await apiService(user().getAll);
    if (response?.success) {
      setUsers(response?.data);
    }
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <HeaderComponent />
      {users?.map((aUser, index) => {
        return <div className={appStyles["user-cnt"]}>{aUser?.email}</div>;
      })}
    </section>
  );
};

export default Users;
