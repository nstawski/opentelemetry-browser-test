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
  const tracer = new BasicTracer();

  const exporterConfig = {
    serviceName: "our-awesome-ui"
  };

  // setup the exporter
  const exporter = new ZipkinExporter(exporterConfig);

  // configure span processor to send spans to the provided exporter
  tracer.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // initialize the OpenTelemetry APIs to use the BasicTracer bindings
  opentelemetry.initGlobalTracer(tracer);

  const startSpan = (
    name: string,
    attributes: SpanAttributes,
    parent?: Span,
    eventName?: string
  ) => {
    let span: Span = parent
      ? tracer.startSpan(name, { parent })
      : tracer.startSpan(name);

    for (let attr in attributes) {
      if (!attributes.hasOwnProperty("attr")) continue;
      span.setAttribute(attr, attributes[attr]);
    }

    if (eventName) {
      span.addEvent(eventName);
    }

    span.end();

    return span;
  };

  return {
    startSpan
  };
};
