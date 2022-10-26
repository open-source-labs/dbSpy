import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);
import { getParsedCommandLineOfConfigFile } from 'typescript';

const mySqlLogController = {};

//this is not yet functional, need to connect to mySQL db to download logging data
export const getLogInfo = async (req, res, next) => {
  //return sample logging information for mySQL
  res.locals.logTable = {
    Name: 'sampleLogTable',
    Properties: [
      {
        Context: 'sample context',
        EnumVals: null,
        Name: 'sample log name',
        Setting: '-1',
        Source: 'default',
        SourceFile: null,
      },
      {
        Context: 'another sample context',
        EnumVals: null,
        Name: 'another sample log name',
        Setting: '3',
        Source: 'default',
        SourceFile: null,
      },
    ],
  };
  return next();
};
