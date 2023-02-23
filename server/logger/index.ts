/**
 * Creates colored alert via log.info()
 **/
import pino from 'pino';
import dayjs from 'dayjs';

const transport = pino.transport({
  targets: [
    { level: 'info', target: 'pino-pretty', options: { colorize: true } },
    {
      level: 'trace',
      target: 'pino/file',
      options: { destination: './serverLog.txt' },
    },
  ],
});

const log = pino(
  {
    base: { pid: false },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  transport
);

export default log;
