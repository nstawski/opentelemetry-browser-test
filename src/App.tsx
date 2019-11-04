import React from "react";
import logo from "./logo.svg";
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

  let currentParent: Span;

  const startButtonSpan = (id: string) => {
    const spanAttriutes: SpanAttributes = { buttonID: id, event: "click" };
    if (currentParent) {
      spanAttriutes["parent"] = currentParent;
    }
    currentParent = startSpan(spanAttriutes, currentParent);
  };

  const endAllSpans = () => {
    endSpan(currentParent);
  };

  const buttons = Array.from({length: 8}, (v, k) => k+1);;

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
        <button key="end" onClick={endAllSpans}>
          End span
        </button>
      </header>
    </div>
  );
};

export default App;
