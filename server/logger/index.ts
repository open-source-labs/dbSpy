/**
 * Creates colored alert via log.info()
 **/
import pinoModule from 'pino';
import dayjs from 'dayjs';

// TS thinks pink is not a function anymore - can't import pino from 'pino'
// with "type": "module" & "moduleResolution": "NodeNext", TS expects CommonJS modules to be imported differently
// Pino is published as CmmonJS (cjs) not ESM
// Need to do a "default" import manually in this case
const pino = pinoModule.default;

const transport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true },
});

const log = pino(
  {
    base: { pid: false },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  transport
);

export default log;
