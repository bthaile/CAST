import React, { useState } from "react";
import { ArrowLeft, CheckMark } from "../Svg";
import Loader from "../Loader";

function StepByStep({ finalLabel, steps, onSubmit, creatingProposal }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepValid, setStepValid] = useState(false);
  const [stepsData, setStepsData] = useState({});

  const onStepAdvance = (direction = "next") => {
    if (direction === "next") {
      if (currentStep + 1 <= steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else if (direction === "prev") {
      if (currentStep - 1 >= 0) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const getStepIcon = (stepIdx, stepLabel) => {
    const stepClasses = [];
    let divider = null;
    if (!stepLabel && stepIdx < steps.length - 1) {
      stepClasses.push("mr-2");
      divider = (
        <span
          className="has-background-grey-light ml-2"
          style={{
            height: "1px",
            width: 20,
            position: "relative",
            top: 14,
          }}
        />
      );
    }
    if (stepLabel) {
      stepClasses.push("mb-6");
    }
    if (stepIdx === currentStep) {
      return (
        <div className={`is-flex ${stepClasses.join(" ")}`} key={stepIdx}>
          <div
            className="rounded-full has-background-orange is-flex is-align-items-center is-justify-content-center"
            style={{
              width: 30,
              height: 30,
            }}
          >
            <b>{stepIdx + 1}</b>
          </div>
          {stepLabel ? <b className="ml-4">{stepLabel}</b> : divider}
        </div>
      );
    } else if (currentStep > stepIdx) {
      return (
        <div className={`is-flex ${stepClasses.join(" ")}`} key={stepIdx}>
          <CheckMark />
          {stepLabel ? <span className="ml-4">{stepLabel}</span> : divider}
        </div>
      );
    } else {
      return (
        <div className={`is-flex ${stepClasses.join(" ")}`} key={stepIdx}>
          <div
            className="rounded-full border-light is-flex is-align-items-center is-justify-content-center"
            style={{
              width: 30,
              height: 30,
            }}
          >
            {stepIdx + 1}
          </div>
          {stepLabel ? <span className="ml-4">{stepLabel}</span> : divider}
        </div>
      );
    }
  };

  const child = steps[currentStep].component;

  const getBackLabel = () => (
    <div
      className="is-flex is-align-items-center has-text-grey cursor-pointer"
      onClick={() => onStepAdvance("prev")}
    >
      <ArrowLeft />
      <span className="ml-4">Back</span>
    </div>
  );

  const getNextButton = () => (
    <div className="mt-6">
      <div
        className={`button is-block has-background-yellow rounded-sm py-2 px-4 has-text-centered ${
          !isStepValid && "is-disabled"
        }`}
        onClick={() => onStepAdvance("next")}
      >
        Next
      </div>
    </div>
  );

  const getSubmitButton = () => (
    <div className="mt-6">
      <div
        className={`button is-block has-background-yellow rounded-sm py-2 px-4 has-text-centered ${
          !isStepValid && "is-disabled"
        }`}
        onClick={() => onSubmit(stepsData)}
      >
        {finalLabel}
      </div>
    </div>
  );

  return (
    <section>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "50%",
          height: "100vh",
          zIndex: -1,
        }}
        className="has-background-white-ter is-hidden-mobile"
      />
      <div className="container is-flex is-flex-direction-column-mobile">
        {/* left panel */}
        <div
          style={{
            paddingTop: "5rem",
            paddingRight: "5rem",
            minWidth: 280,
          }}
          className="has-background-white-ter pl-4 is-hidden-mobile"
        >
          <div className="mb-6" style={{ minHeight: 24 }}>
            {currentStep > 0 && getBackLabel()}
          </div>
          <div>{steps.map((step, i) => getStepIcon(i, step.label))}</div>
          {currentStep < steps.length - 1 && getNextButton()}
          {currentStep === steps.length - 1 && getSubmitButton()}
        </div>
        {/* left panel mobile */}
        <div className="is-hidden-tablet has-background-white-ter p-4">
          <div className="is-flex is-justify-content-space-between is-align-items-center">
            <div style={{ minHeight: 24 }}>
              {currentStep > 0 && getBackLabel()}
            </div>
            <div className="is-flex">
              {steps.map((step, i) => getStepIcon(i, null))}
            </div>
          </div>
        </div>
        {/* right panel */}
        <div className="step-by-step-body flex-1 has-background-white px-4-mobile pt-0-mobile">
          {creatingProposal && (
            <div
              className="is-flex flex-1 is-flex-direction-column is-align-items-center is-justify-content-center"
              style={{ height: "100%" }}
            >
              <Loader className="mb-4" />
              <p className="has-text-grey">Creating Proposal...</p>
            </div>
          )}

          {!creatingProposal &&
            React.cloneElement(child, {
              onDataChange: (stepData) => {
                setStepsData({
                  ...stepsData,
                  [currentStep]: {
                    ...stepsData[currentStep],
                    ...stepData,
                  },
                });
              },
              setStepValid,
              stepData: stepsData[currentStep],
              stepsData,
            })}
          <div className="is-hidden-tablet">
            {currentStep < steps.length - 1 && getNextButton()}
            {currentStep === steps.length - 1 && getSubmitButton()}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StepByStep;
