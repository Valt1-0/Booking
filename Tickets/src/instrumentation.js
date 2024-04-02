const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const { SEMRESATTRS_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");

function installInstrumentation({ serviceName }) {
  console.log("installInstrumentation");
  const resource = new opentelemetry.resources.Resource({
    [SEMRESATTRS_SERVICE_NAME]: serviceName,
  });
  const sdk = new opentelemetry.NodeSDK({
    resource,
    traceExporter: new OTLPTraceExporter({
      url: "http://localhost:4318/v1/traces",
    }),
    // metricReader: new PeriodicExportingMetricReader({
    //   exporter: new OTLPMetricExporter({
    //     // url: '<your-otlp-endpoint>/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
    //     headers: {}, // an optional object containing custom headers to be sent with each request
    //   }),
    // }),
    instrumentations: [getNodeAutoInstrumentations({})],
  });
  sdk.start();
}

installInstrumentation({ serviceName: "tickets" });
