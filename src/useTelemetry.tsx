import React, { useState } from "react";

import * as opentelemetry from "@opentelemetry/core";
import { BasicTracer, SimpleSpanProcessor } from "@opentelemetry/tracing";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { Span } from "@opentelemetry/types";

type SpanAttributes = {
  [key: string]: any;
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

  const startSpan = (
    attributes: SpanAttributes,
    parent?: Span,
    eventName?: string
  ) => {
    // To create a span in a trace, we used the global singleton tracer to start a new span.
    let span: Span;
    if (parent) {
      span = tracer.startSpan("bar", { parent });
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
    parent && span.end();
    return span;
  };

  const endSpan = (span: any) => {
    span.end();
  };

  return {
    startSpan,
    endSpan
  };
};
