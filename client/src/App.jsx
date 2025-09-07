import { useState } from 'react';
import './App.css';
import Step from './Step';

function App() {
  const [rawInstructions, setRawInstructions] = useState('');
  const [instructionSteps, setInstructionSteps] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
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
  // For now, we will disable refinement and keep comment logic as is (it works on the frontend state).
  const handleStepChange = (stepId, updatedStep) => {
    // This function is now effectively disabled as the backend handles all generation.
    // We could re-wire this to call a new backend endpoint for refinement.
    console.log("Step refinement is not yet wired to the backend.");
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
        </>
      )}
    </div>
  );
}

export default App;
