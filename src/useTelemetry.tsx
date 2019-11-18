import * as opentelemetry from "@opentelemetry/core";
import { BasicTracer, SimpleSpanProcessor } from "@opentelemetry/tracing";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { Span } from "@opentelemetry/types";

export type SpanAttributes = {
  [key: string]: any;
  buttonID: string;
  event: string;
  parent?: Span;
};

export const useTelemetry = () => {
  // create a tracer
  // setup the exporter with config
  // configure span processor to send spans to the provided exporter
  // initialize the OpenTelemetry APIs to use the BasicTracer bindings

  const startSpan = (
    name: string,
    attributes: SpanAttributes,
    parent?: Span,
    eventName?: string
  ) => {
    // create span
    // set span attributes
    // add event if exists
    // end and return the span
  };

  return {
    startSpan
};
