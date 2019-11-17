import React from "react";
import "./App.css";

import { useTelemetry } from "./useTelemetry";
import { Span } from "@opentelemetry/types";

type SpanAttributes = {
  buttonID: string;
  event: string;
  parent?: Span;
};

const App: React.FC = () => {
  const { startSpan, endSpan } = useTelemetry();

  let currentParent: Span | undefined;

  const startButtonSpan = (id: string) => {
    const spanAttriutes: SpanAttributes = { buttonID: id, event: "click" };
    const span = startSpan(spanAttriutes, currentParent);
    if (!currentParent) {
      currentParent = span;
    }
  };

  const endAllSpans = () => {
    endSpan(currentParent);
    currentParent = undefined;
  };

  const buttons = Array.from({ length: 8 }, (v, k) => k + 1);

  return (
    <div className="App">
      <header className="App-header">
        {buttons.map(button => (
          <button
            key={`button-${button}`}
            onClick={() => startButtonSpan(button.toString())}
          >
            Click me {button}
          </button>
        ))}
        <button key="end" onClick={endAllSpans} className="end">
          End parent span
        </button>
      </header>
    </div>
  );
};

export default App;
