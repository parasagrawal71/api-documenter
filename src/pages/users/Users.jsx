import React, { useState, useEffect } from "react";
import { Select, Chip, FormControl, MenuItem } from "@material-ui/core";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import HeaderComponent from "components/header/Header";
import apiService from "apis/apiService";
import { user, service } from "apis/urls";

// IMPORT ASSETS HERE
import appStyles from "./Users.module.scss";

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    getUsers();
    getServices();
  }, []);

  const getUsers = async () => {
    const response = await apiService(user().getAll);
    if (response?.success) {
      setUsers(response?.data);
    }
  };

  const getServices = async () => {
    const response = await apiService(service().getAll);
    if (response?.success) {
      setServiceList(response?.data);
    }
  };

  const updateUser = async (updatedUser) => {
    const response = await apiService(user(updatedUser?._id).put, updatedUser);
    if (response?.success) {
      //
    }
  };

  const handleServiceOptionsChange = (event, currentUser) => {
    const selectedOptions = event?.target?.value;
    const updatedUsers = users.map((aUser) => {
      if (aUser?._id === currentUser?._id) {
        aUser.editAccess = selectedOptions;
      }

      return aUser;
    });

    setUsers(updatedUsers);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <section className={appStyles["main-cnt"]}>
      <HeaderComponent />
      <section className={appStyles["users-cnt"]}>
        {users?.map((aUser, index) => {
          return (
            <section key={index} className={appStyles["user-cnt"]}>
              <section className={appStyles["user-cnt--left"]}>
                <div className={appStyles["user-cnt__name"]}>{aUser?.name}</div>
                <div className={appStyles["user-cnt__email"]}>{aUser?.email}</div>
              </section>
              <FormControl className={appStyles.formControl}>
                <Select
                  multiple
                  displayEmpty
                  value={aUser?.editAccess}
                  onChange={(e) => handleServiceOptionsChange(e, aUser)}
                  onClose={() => {
                    updateUser(aUser);
                  }}
                  renderValue={(selected) => (
                    <div className={appStyles.chips}>
                      {selected?.length ? (
                        selected?.map((serviceName) => (
                          <Chip key={serviceName} label={serviceName} className={appStyles.chip} />
                        ))
                      ) : (
                        <em>Select services</em>
                      )}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  <MenuItem disabled value="">
                    <em>Select services</em>
                  </MenuItem>
                  {serviceList?.map((aService) => (
                    <MenuItem
                      key={aService?._id}
                      value={aService?.serviceName}
                      className={cx(appStyles["menu-item"], {
                        [appStyles.selected]: aUser?.editAccess?.indexOf(aService?.serviceName),
                      })}
                    >
                      {aService?.serviceName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </section>
          );
        })}
      </section>
    </section>
  );
};

export default Users;
