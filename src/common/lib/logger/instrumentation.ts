import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { LoggerProvider, BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { logs } from "@opentelemetry/api-logs";
import { env } from "../../../config/env";

// Describe the service
const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME,
  [ATTR_SERVICE_VERSION]: "1.0.0",
});

const provider = new NodeTracerProvider({
  resource,
});
provider.register();

const loggerProvider = new LoggerProvider({
  resource,
  processors: [
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
      }),
    ),
  ],
});

// Set global logger provider so WinstonInstrumentation can use it
logs.setGlobalLoggerProvider(loggerProvider);

registerInstrumentations({
  instrumentations: [
    new WinstonInstrumentation({
      // Optional hook to insert additional context to log metadata.
      disableLogCorrelation: false, // inject trace_id, span_id, trace_flags
      disableLogSending: true, // forward logs to OpenTelemetry Logs SDK
    }),
  ],
});
