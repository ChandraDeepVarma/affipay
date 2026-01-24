"use client";

import { useEffect } from "react";

const Progress = ({ percentage, variant = "primary" }) => {
  useEffect(() => {
    let floatingLabel = document.querySelector(
      `[data-perc='${percentage}'] .floating-label`
    );

    if (floatingLabel) {
      floatingLabel.style.setProperty("--left-percentage", percentage);
      floatingLabel.style.animationName = "none";
      floatingLabel.style.left = percentage;
      floatingLabel.style.animationName = "animateFloatingLabel";
    }
  }, [percentage]);

  return (
    <div
      className='progress-wrapper d-flex align-items-center flex-column gap-4'
      data-perc={percentage}
    >
      <div className='h-50-px position-relative w-100 d-flex'>
        <span className='floating-label position-absolute text-xs fw-semibold text-secondary-light bg-base border radius-8 w-50-px h-32-px z-1 shadow d-flex justify-content-center align-items-center'>
          {percentage}
        </span>
        <div
          className='progress mt-auto h-8-px w-100 bg-primary-50'
          role='progressbar'
          aria-label='Basic example'
          aria-valuenow={parseInt(percentage, 10)}
          aria-valuemin='0'
          aria-valuemax='100'
        >
          <div
            className={`progress-bar animated-bar rounded-pill bg-${variant}-gradien overflow-visible`}
            style={{ width: percentage }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const GradientProgressTwo = () => {
  return (
    <div className='col'>
     <div>
          {/* First Progress Bar (10%) */}
          <Progress percentage='10%' variant="primary"/>

          {/* Second Progress Bar (30%) */}
          <Progress percentage='30%' variant="success"/>

          {/* Third Progress Bar (50%) */}
          <Progress percentage='50%' variant="warning"/>

          {/* Fourth Progress Bar (70%) */}
          <Progress percentage='70%' variant="danger"/>
        </div>
    </div>
  );
};

export default GradientProgressTwo;
