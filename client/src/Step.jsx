import React, { useState } from 'react';
import './Step.css';
import Comments from './Comments';

const Step = ({ step, onStepChange, isPublished, onPostComment }) => {
  const [currentText, setCurrentText] = useState(step.text);

  // Check if we have an actual image path (from dev mode)
  const hasImage = step.imagePrompt && step.imagePrompt.startsWith('/steps/');
  const [currentImagePrompt, setCurrentImagePrompt] = useState(hasImage ? '' : step.imagePrompt);

  const handleTextRefine = () => {
    onStepChange(step.id, { ...step, text: currentText });
  };

  const handleImageRefine = () => {
    onStepChange(step.id, { ...step, imagePrompt: currentImagePrompt });
  };

  return (
    <div className="step-widget">
      <h3>{step.title}</h3>
      <div className="step-content">
        <div className="step-details">
          <div className="step-text-container">
            {isPublished ? (
              <p className="step-text">{step.text}</p>
            ) : (
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
          {!isPublished && (
            <div className="refine-group">
              <input
                type="text"
                value={currentImagePrompt}
                onChange={(e) => setCurrentImagePrompt(e.target.value)}
                className="refine-input"
                placeholder="Refine image prompt..."
              />
              <button onClick={handleImageRefine}>Refine Image</button>
            </div>
          )}
        </div>
        <div className="step-image-container">
          {hasImage ? (
            <img 
              src={step.imagePrompt} 
              alt={step.title}
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          ) : (
            <div className="step-image-placeholder">
              <p>Image for: "{step.imagePrompt}"</p>
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
