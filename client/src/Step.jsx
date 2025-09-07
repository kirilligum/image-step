import React, { useState } from 'react';
import './Step.css';
import Comments from './Comments';

const Step = ({ step, onStepChange, isPublished, onPostComment }) => {
  // The local state for inputs is still useful for a controlled component,
  // even if the backend refinement is not yet wired up.
  const [currentText, setCurrentText] = useState(step.text);
  const [currentImagePrompt, setCurrentImagePrompt] = useState(step.imagePrompt);

  const handleRefineClick = () => {
    alert("Refinement functionality is not yet implemented in this version.");
  };

  return (
    <div className="step-widget">
      <h3>{step.title}</h3>
      <div className="step-content">
        <div className="step-image-container">
          <div className="step-image-placeholder">
            {step.imageData && step.imageData !== 'failed' ? (
              <img src={`data:image/png;base64,${step.imageData}`} alt={step.title} className="generated-image" />
            ) : step.imageData === 'failed' ? (
              <p>Image generation failed.</p>
            ) : (
              <p>Generating image...</p>
            )}
          </div>
          {!isPublished && (
            <div className="refine-group">
              <input
                type="text"
                value={currentImagePrompt}
                onChange={(e) => setCurrentImagePrompt(e.target.value)}
                className="refine-input"
                readOnly // Make read-only until refinement is implemented
              />
              <button onClick={handleRefineClick} disabled>
                Refine Image
              </button>
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
                readOnly // Make read-only until refinement is implemented
              />
              <button onClick={handleRefineClick} disabled>
                Refine Text
              </button>
            </div>
          )}
        </div>
      </div>
      {isPublished && (
        <Comments
          stepId={step.id}
          comments={step.comments}
          onPostComment={onPostComment}
        />
      )}
    </div>
  );
};

export default Step;
