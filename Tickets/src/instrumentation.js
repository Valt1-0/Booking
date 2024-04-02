const { installInstrumentation } = require('@Telemetry/telemetry');
console.log('Instrumentation for tickets service is being installed');
installInstrumentation({ serviceName: 'tickets' });