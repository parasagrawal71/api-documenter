export const INITIAL_STATE = {
  toastState: {
    position: "top-right",
    autoCloseTime: 3000,
  },
};

export const actions = {
  updateToastState: (store, newToastState) => {
    store.setState({ toastState: newToastState });
  },
};
