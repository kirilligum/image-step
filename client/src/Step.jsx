import React, { useState } from 'react';
import './Step.css';

const Step = ({ step, onStepChange, isPublished }) => {
  const [currentText, setCurrentText] = useState(step.text);
  const [currentImagePrompt, setCurrentImagePrompt] = useState(step.imagePrompt);

  const handleTextRefine = () => {
    // In a real app, this would trigger an API call.
    // For now, we update the parent component's state.
    onStepChange(step.id, { ...step, text: currentText });
  };

  const handleImageRefine = () => {
    onStepChange(step.id, { ...step, imagePrompt: currentImagePrompt });
  };

  return (
    <div className="step-widget">
      <h3>{step.title}</h3>
      <div className="step-content">
        <div className="step-image-container">
          <div className="step-image-placeholder">
            <p>Image for: "{step.imagePrompt}"</p>
          </div>
          {!isPublished && (
            <div className="refine-group">
              <input
                type="text"
                value={currentImagePrompt}
                onChange={(e) => setCurrentImagePrompt(e.target.value)}
                className="refine-input"
              />
              <button onClick={handleImageRefine}>Refine Image</button>
            </div>
          )}
        </div>
        <div className="step-text-container">
          <p className="step-text">{step.text}</p>
          {!isPublished && (
            <div className="refine-group">
              <textarea
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                className="refine-textarea"
              />
              <button onClick={handleTextRefine}>Refine Text</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step;
