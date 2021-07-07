export const INITIAL_STATE = {
  toastState: {
    position: "top-right",
    autoCloseTime: 2000,
  },
  loggedInUser: {},
};

export const actions = {
  updateToastState: (store, newToastState) => {
    store.setState({ toastState: newToastState });
  },

  updateLoggedInUser: (store, updatedUser) => {
    store.setState({ loggedInUser: updatedUser });
  },
};
