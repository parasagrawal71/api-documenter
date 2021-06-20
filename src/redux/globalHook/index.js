import React from "react";
import globalHook from "use-global-hook";

import { actions, INITIAL_STATE } from "./actions";

const useGlobal = globalHook(React, INITIAL_STATE, actions);

export default useGlobal;
