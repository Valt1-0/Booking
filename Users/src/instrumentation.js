const {
  BatchSpanProcessor,
} = require("@opentelemetry/sdk-trace-base");
const { Resource } = require('@opentelemetry/resources')
const {
  SEMRESATTRS_SERVICE_NAME,
} = require("@opentelemetry/semantic-conventions");
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");


const init = (serviceName) => {

  const otlpExporter = new OTLPTraceExporter();


const provider = new NodeTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: serviceName ,
  }),
});

provider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));

provider.register()

console.log('tracing initialized')

// Register insturmentation for tracing
registerInstrumentations({
instrumentations: [new ExpressInstrumentation(), new HttpInstrumentation()],
})

const tracer = provider.getTracer(serviceName)
return { tracer }
}

module.exports = {
init: init,
}