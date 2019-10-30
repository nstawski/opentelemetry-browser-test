import React, { useState } from "react";

import * as opentelemetry from "@opentelemetry/core";
import { BasicTracer, SimpleSpanProcessor } from "@opentelemetry/tracing";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { Span } from "@opentelemetry/types";

type SpanAttributes = {
  [key: string]: any;
};

type Traces = {
  [key: string]: Span;
};

export const useTelemetry = () => {
  // Create a Tracer. The default traces does not record any tracing information
  const tracer = new BasicTracer();

  const exporterOptions = {
    serviceName: "our-awesome-ui"
  };

  // Setup the exporter
  const exporter = new ZipkinExporter(exporterOptions);

  // Configure span processor to send spans to the provided exporter
  tracer.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the BasicTracer bindings
  opentelemetry.initGlobalTracer(tracer);

  // // We must end the spans so they becomes available for exporting.
  // span.end();

  const startSpan = (
    attributes: SpanAttributes,
    parent?: Span,
    eventName?: string
  ) => {
    // To create a span in a trace, we used the global singleton tracer to start a new span.
    let span: Span;
    if (parent) {
      span = tracer.startSpan("bar", { parent: parent.context() });
    } else {
      span = tracer.startSpan("foo");
    }

    // Create Attributes
    for (let attr in attributes) {
      if (!attributes.hasOwnProperty(attr)) continue;
      span.setAttribute(attr, attributes[attr]);
    }

    // Annotate the span with the event name if it is provided
    if (eventName) {
      span.addEvent(eventName);
    }
    // span.attributes.parent && span.end();
    return span;
  };

  const endSpan = (span: any) => {
    const traceParams = tracer.getActiveTraceParams();
    console.log("traceParams", traceParams);
    console.log("span", span);
    span && span.end();
    span.attributes.parent && endSpan(span.attributes.parent);

    tracer.getCurrentSpan();
  };

  return {
    startSpan,
    endSpan
  };
};
