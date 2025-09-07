import { useState } from 'react';
import './App.css';
import Step from './Step';
import placeholderSteps from './placeholderSteps';

const MOCK_API_RESPONSE = {
  overview: "This project outlines how to build a sturdy 10x20 EMT shade structure, ideal for events like Burning Man. It uses common fittings and standard 10-foot EMT conduit pipes.",
  overviewSteps: [
    "Assemble the 4 roof rafters.",
    "Build the 2 roof A-frames.",
    "Connect the A-frames with the ridge poles.",
    "Attach the 6 legs.",
    "Secure the structure with a tarp."
  ],
  detailedSteps: [
    {
      id: 1,
      title: "Step 1: Assemble the Roof Rafters",
      text: "Take four 10-foot EMT pipes. On each pipe, mark the center point at 5 feet. Using a pipe bender, create a 15-degree bend at the center mark. You will now have four bent rafters.",
      imagePrompt: "A clear, black and white diagram showing a 10-foot EMT pipe with a 15-degree bend at its center. Ikea assembly instruction style.",
      comments: []
    },
    {
      id: 2,
      title: "Step 2: Build the Roof A-Frames",
      text: "Take two of the bent rafters and an A-frame connector. Slide the ends of the two rafters into the connector to form a peak. Secure them with the provided eye-bolts. Repeat this for the other two rafters to create a second A-frame.",
      imagePrompt: "A clear, black and white diagram showing two bent EMT pipes being inserted into a metal A-frame peak connector with eye-bolts. Ikea assembly instruction style.",
      comments: []
    },
    {
      id: 3,
      title: "Step 3: Connect the A-Frames",
      text: "Stand the two A-frames up, about 10 feet apart. Take two new 10-foot EMT pipes (these are your ridge poles). Connect the two A-frames at their peaks using these two ridge poles and four-way connectors.",
      imagePrompt: "A clear, black and white diagram showing two A-frames being connected at the top by two parallel 10-foot EMT pipes. Ikea assembly instruction style.",
      comments: []
    }
  ]
};


function App() {
  const [rawInstructions, setRawInstructions] = useState('');
  const [instructionSteps, setInstructionSteps] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const handleGenerate = () => {
    if (devMode) {
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
    } else {
      console.log('Generating instructions for:', rawInstructions);
      // Simulate API call
      setInstructionSteps(MOCK_API_RESPONSE);
    }
  };

  const handleStepChange = (stepId, updatedStep) => {
    const updatedSteps = instructionSteps.detailedSteps.map((step) =>
      step.id === stepId ? updatedStep : step
    );
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
    console.log("Instructions published!");
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

      {!instructionSteps ? (
        <>
          <p>
            Enter the instructions for your project below. The more detailed, the better!
          </p>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={devMode}
              onChange={(e) => setDevMode(e.target.checked)}
            />
            Dev Mode (Use Placeholders)
          </label>
          <textarea
            className="instructions-textarea"
            value={rawInstructions}
            onChange={(e) => setRawInstructions(e.target.value)}
            placeholder="e.g., How to assemble a 10x20 EMT shade structure for Burning Man..."
          />
          <button onClick={handleGenerate}>
            Generate Instructions
          </button>
        </>
      ) : (
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
      )}
    </div>
  );
}

export default App;
