import React, { useState } from "react";
import { Span } from "@opentelemetry/types";

import "./App.css";
import { useTelemetry, SpanAttributes } from "./useTelemetry";

const App: React.FC = () => {
  const { startSpan } = useTelemetry();
  const [currentParent, setCurrentParent] = useState<Span>();

  const startButtonSpan = (button: string) => {
    const spanAttributes: SpanAttributes = {
      buttonID: button,
      event: "click"
    };

    const span = startSpan(spanAttributes, currentParent);

    if (!currentParent) {
      setCurrentParent(span);
    }
  };

  const endParentSpan = () => {
    setCurrentParent(undefined);
  };

  const buttons = Array.from({ length: 8 }, (v, k) => (k + 1).toString());

  return (
    <div className="App">
      <header className="App-header">
        {buttons.map(button => (
          <button
            key={`button-${button}`}
            onClick={() => startButtonSpan(button)}
          >
            Button #{button}
          </button>
        ))}
        <button
          key="endParentSpan"
          onClick={() => endParentSpan()}
          className="end"
        >
          End parent span
        </button>
      </header>
    </div>
  );
};

export default App;
