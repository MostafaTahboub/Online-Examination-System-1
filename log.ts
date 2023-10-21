import winston from 'winston';

const baseLogger = winston.createLogger({
    // level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    defaultMeta: {project: 'Online Examination System'},
    transports: [
        new winston.transports.File({filename: './logs/error.log', level: 'error'}),
        new winston.transports.File({filename: './logs/all.log', level:'info'}),
        new winston.transports.Console({format: winston.format.simple()})
    ]
});

export default baseLogger;