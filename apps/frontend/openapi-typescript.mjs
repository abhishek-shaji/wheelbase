import dotenv from 'dotenv';
import fs from 'node:fs';
import openapiTS, { astToString } from 'openapi-typescript';

const env = process.argv[2];
dotenv.config({
  path: `.env.${env === 'prod' ? 'production' : 'local'}`,
});

const ast = await openapiTS(`${process.env.API_BASE_URL}/openapi.json`, {
  rootTypes: true,
  generatePathParams: false,
});

fs.writeFileSync('./src/types/__generated__/openapi.ts', astToString(ast));
