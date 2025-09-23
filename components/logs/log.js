const moment = require('moment');
const fs = require('fs');
const path = require('path');
const {
  BASE_DIR,
  CURL_BASE_DIR,
  OLD_LOGS_DIR,
  LOG_FILE_PREFIX,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  FILE_EXTENSIONS,
  REQUEST_SUFFIX,
  RESPONSE_SUFFIX,
  CURL_SUFFIX,
} = require('../../constants');
const { tryParseJson } = require('../../utils');

function prepareLogDirectory(baseDir = BASE_DIR) {
  const logsBaseDir = path.join(__dirname, '..', baseDir);
  const dateStr = moment().format(DATE_FORMAT);
  const logsDir = path.join(logsBaseDir, `${LOG_FILE_PREFIX}${dateStr}`);
  const oldLogsDir = path.join(logsBaseDir, OLD_LOGS_DIR);

  if (!fs.existsSync(oldLogsDir)) {
    fs.mkdirSync(oldLogsDir, { recursive: true });
  }

  if (fs.existsSync(logsBaseDir)) {
    const entries = fs.readdirSync(logsBaseDir, { withFileTypes: true });

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const { name } = entry;
        if (name !== `${LOG_FILE_PREFIX}${dateStr}` && name !== OLD_LOGS_DIR) {
          const src = path.join(logsBaseDir, name);
          const dest = path.join(oldLogsDir, name);

          const finalDest = fs.existsSync(dest)
            ? `${dest}-${moment().format(TIME_FORMAT)}`
            : dest;

          fs.renameSync(src, finalDest);
        }
      }
    }
  }

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  return logsDir;
}

function saveProviderLog({
  action,
  req,
  res,
  code,
  name,
}) {
  prepareLogDirectory();
  const providerReq = tryParseJson(req);
  const providerRes = tryParseJson(res);

  const isReqXml = typeof providerReq !== 'object';
  const isResXml = typeof providerRes !== 'object';

  const dateStr = moment().format(DATE_FORMAT);
  const timeStr = moment().format(DATETIME_FORMAT);
  const logsDir = path.join(
    __dirname,
    '..',
    BASE_DIR,
    `${LOG_FILE_PREFIX}${dateStr}`,
  );

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  let baseFileName = `${timeStr}`;
  if(code) {
    baseFileName += `_${code}`;
  }
  if(name) {
    baseFileName += `_${name}`;
  }
  if(action) {
    baseFileName += `_${action}`;
  }

  const extensions = isResXml ? FILE_EXTENSIONS.XML : FILE_EXTENSIONS.JSON;

  const request = `${baseFileName}_${REQUEST_SUFFIX}.${extensions}`;
  const response = `${baseFileName}_${RESPONSE_SUFFIX}.${extensions}`;

  fs.writeFileSync(
    path.join(logsDir, request),
    isReqXml ? providerReq : JSON.stringify(providerReq, null, 2),
  );

  fs.writeFileSync(
    path.join(logsDir, response),
    isResXml ? providerRes : JSON.stringify(providerRes, null, 2),
  );
}

function buildCurl(request) {
  const method = request.method.toUpperCase();
  const { url } = request;
  const headers = request.headers || {};
  const { body } = request;

  let curl = `curl -X ${method} "${url}"`;

  // eslint-disable-next-line no-restricted-syntax
  for (const key in headers) {
    if (headers[key]) {
      curl += ` \\\n  -H "${key}: ${headers[key]}"`;
    }
  }

  if (body) {
    if (typeof body === 'string') {
      curl += ` \\\n  -d '${body}'`;
    } else {
      const jsonString = JSON.stringify(body);
      curl += ` \\\n  -d '${jsonString}'`;
    }
  }

  return curl;
}

function saveProviderCurl({ name, request, code, action }) {
  prepareLogDirectory(CURL_BASE_DIR);
  const curlCommand = buildCurl(request);

  const dateStr = moment().format(DATE_FORMAT);
  const timeStr = moment().format(DATETIME_FORMAT);
  const logsDir = path.join(
    __dirname,
    '..',
    CURL_BASE_DIR,
    `${LOG_FILE_PREFIX}${dateStr}`,
  );

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  let baseFileName = `${timeStr}`;
  if (code) {
    baseFileName += `_${code}`;
  }
  if (name) {
    baseFileName += `_${name}`;
  }
  if (action) {
    baseFileName += `_${action}`;
  }

  const fileName = `${baseFileName}_${CURL_SUFFIX}.${FILE_EXTENSIONS.TXT}`;

  fs.writeFileSync(path.join(logsDir, fileName), curlCommand);
}

module.exports = {
  saveProviderLog,
  saveProviderCurl,
};
