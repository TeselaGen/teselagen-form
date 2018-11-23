import React from "react";
import { Icon } from "@blueprintjs/core";
import classNames from "classnames";
import { observer } from "mobx-react";

export default observer(
  class Step extends React.Component {
    setActiveStep() {
      const { step, disabled, setActive } = this.props;
      !disabled && setActive(step);
    }
    render() {
      const { step, title, complete, active, disabled } = this.props;
      return (
        <div
          onClick={() => {
            this.setActiveStep();
          }}
          className={classNames("step-group", { complete, active, disabled })}
        >
          <div className="step-mark">
            {complete ? <Icon icon="tick" /> : step + 1}
          </div>
          <div className="step-text">{title}</div>
        </div>
      );
    }
  }
);
