import React, { useEffect } from "react";
import { ClickAwayListener } from "@material-ui/core";
import cx from "classnames";

// IMPORT USER-DEFINED COMPONENTS HERE
import appStyles from "./GenericActionsPopover.module.scss";

export default function GenericActionsPopover(props) {
  // PROPS HERE
  const { openPopover, setOpenPopover, options, optionsCallbacks, containerClass, optionCntClass } = props;

  return openPopover ? (
    <ClickAwayListener
      onClickAway={() => {
        setOpenPopover(false);
      }}
    >
      <section className={cx(appStyles["actions-cnt"], containerClass)}>
        {options &&
          options?.map((option, index) => {
            return (
              <div
                role="button"
                onKeyDown={() => {}}
                tabIndex="0"
                key={index}
                className={cx(appStyles["actions-option-cnt"], optionCntClass)}
                onClick={(e) => {
                  e?.stopPropagation();
                  if (optionsCallbacks?.[index]) {
                    optionsCallbacks?.[index]();
                  }
                }}
              >
                {option}
              </div>
            );
          })}
      </section>
    </ClickAwayListener>
  ) : null;
}
