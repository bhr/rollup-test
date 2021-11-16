import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { Span, trace, TracerProvider } from '@opentelemetry/api';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

// eslint-disable-next-line no-underscore-dangle
let _provider: NodeTracerProvider | undefined;

const getProvider = (): NodeTracerProvider => {
  if (_provider) {
    return _provider;
  }

  _provider = new NodeTracerProvider();
  _provider.register();

  // Initialize the exporter. When your application is running on Google Cloud,
  // you don't need to provide auth credentials or a project id.
  const exporter = new TraceExporter();

  registerInstrumentations({
    tracerProvider: _provider,
    instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
  });

  // Configure the span processor to send spans to the exporter
  _provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  return _provider;
};

export const startTracingSpan = (name: string): Span => {
  const provider = getProvider();
  trace.setGlobalTracerProvider((provider as unknown) as TracerProvider);
  const tracer = trace.getTracer('basic');
  const span = tracer.startSpan(name);
  return span;
};
