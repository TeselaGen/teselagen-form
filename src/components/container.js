import React, { Component } from "react";
import Element from "./element";
import { observer } from "mobx-react";
import { Intent, Button, Classes, Callout } from "@blueprintjs/core";
import Step from "./step";

export default observer(
  class container extends Component {
    renderStepNav() {
      const {
        submitting,
        formStore: {
          wizard: { setPage, page },
          elements
        }
      } = this.props;
      let acc = [];
      elements.map((step, i) => {
        acc.push(
          <Step
            key={i}
            title={step.title}
            complete={page > i}
            active={page === i}
            disabled={page < i || submitting}
            setActive={() => {
              setPage(i);
            }}
            step={i}
          />
        );
        if (i < elements.length - 1)
          acc.push(
            <div key={`step-separator-${i}`} className="step-separator" />
          );
      });
      return acc;
    }

    render() {
      const { form, formStore } = this.props;
      return (
        <div className="tg-step-form-container">
          <div className="tg-step-form-title-and-nav-container">
            {formStore.isWizard && (
              <div className="tg-step-form-nav">{this.renderStepNav()}</div>
            )}
          </div>
          <div
            style={
              formStore.error.status
                ? { display: "block", paddingBottom: "10px" }
                : { display: "none" }
            }
          >
            <Callout
              className={Classes.MINIMAL}
              intent={Intent[formStore.error.intent]}
              title={formStore.error.errorMessage}
            />
          </div>
          <div>
            {form.elements[formStore.wizard.page].fields.map(item => (
              <Element key={item.index} formStore={formStore} item={item} />
            ))}
          </div>
          {formStore.isWizard && (
            <div className="tg-step-form-buttons">
              <Button
                icon="arrow-right"
                text="Next"
                className={Classes.MINIMAL}
                intent={Intent.PRIMARY}
                onClick={() => formStore.nextPage(formStore.wizard.page)}
              />
            </div>
          )}
        </div>
      );
    }
  }
);
