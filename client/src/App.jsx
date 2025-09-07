import { useState } from 'react';
import './App.css';
import Step from './Step';
import placeholderSteps from './placeholderSteps';

function App() {
  const [rawInstructions, setRawInstructions] = useState('');
  const [instructionSteps, setInstructionSteps] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const handleGenerate = async () => {
    if (devMode) {
      setIsLoading(true);
      // Simulate a 5-second network delay in dev mode
      await new Promise(resolve => setTimeout(resolve, 5000));
      // Use placeholder steps when in dev mode
      setInstructionSteps({
        overview: "This project outlines how to build a sturdy 10x20 EMT shade structure, ideal for events like Burning Man. It uses common fittings and standard 10-foot EMT conduit pipes.",
        overviewSteps: [
          "Materials & Tools Checklist",
          "Cut Your Legs (Pre-Playa Preparation)",
          "The Home Build (Test Assembly)",
          "Label Everything! (Pre-Playa Preparation)",
          "Assemble the Roof (On-Playa Assembly)",
          "Attach the Shade Cloth (On-Playa Assembly)",
          "Raise The Structure (On-Playa Assembly)",
          "Secure Bungees (On-Playa Assembly)",
          "Drive the Lag Bolts (Anchoring for High Winds)",
          "Attach Ratchet Straps (Anchoring for High Winds)"
        ],
        detailedSteps: placeholderSteps
      });
      setIsLoading(false);
      return;
    }

    if (!rawInstructions || isLoading) return;

    setIsLoading(true);
    setInstructionSteps(null);
    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: rawInstructions }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setInstructionSteps(result);

    } catch (error) {
      console.error("Error fetching from backend:", error);
      alert("Failed to generate instructions. Please check the console and make sure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // The refinement and comment logic now needs to be re-wired if we want to support it.
  // For now, refinement works on the frontend state.
  const handleStepChange = (stepId, updatedStep) => {
    const updatedSteps = instructionSteps.detailedSteps.map((step) => {
      if (step.id === stepId) {
        return updatedStep;
      }
      return step;
    });
    setInstructionSteps({ ...instructionSteps, detailedSteps: updatedSteps });
  };

  const handlePostComment = (stepId, commentText) => {
    const newComment = { id: Date.now(), text: commentText };
    const updatedSteps = instructionSteps.detailedSteps.map((step) => {
      if (step.id === stepId) {
        return { ...step, comments: [...step.comments, newComment] };
      }
      return step;
    });
    setInstructionSteps({ ...instructionSteps, detailedSteps: updatedSteps });
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  const handleGenerateKnowledge = () => {
    if (!instructionSteps) return;
    const dataStr = JSON.stringify(instructionSteps, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-knowledge.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <h1>DIY Visual Instruction Generator</h1>

      {isLoading ? (
        <h2>Generating your instructions... Please wait.</h2>
      ) : instructionSteps ? (
        <div className="instructions-container">
          <div className="actions-header">
            <button onClick={handlePublish} disabled={isPublished}>
              {isPublished ? "Published" : "Publish"}
            </button>
            <button onClick={handleGenerateKnowledge}>
              Generate AI Knowledge
            </button>
          </div>
          <h2>{instructionSteps.overview}</h2>
          <h3>Steps:</h3>
          <ol className="overview-steps-list">
            {instructionSteps.overviewSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <hr />
          {instructionSteps.detailedSteps.map((step) => (
            <Step
              key={step.id}
              step={step}
              onStepChange={handleStepChange}
              isPublished={isPublished}
              onPostComment={handlePostComment}
              devMode={devMode}
            />
          ))}
        </div>
      ) : (
        <>
          <p>
            Enter the instructions for your project below. The more detailed, the better!
          </p>
          <textarea
            className="instructions-textarea"
            value={rawInstructions}
            onChange={(e) => setRawInstructions(e.target.value)}
            placeholder="e.g., How to assemble a 10x20 EMT shade structure for Burning Man..."
          />
          <button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Instructions"}
          </button>
          <label style={{ display: 'block', marginTop: '1rem' }}>
            <input
              type="checkbox"
              checked={devMode}
              onChange={(e) => setDevMode(e.target.checked)}
            />
            dev/prod
          </label>
        </>
      )}
    </div>
  );
}

export default App;
