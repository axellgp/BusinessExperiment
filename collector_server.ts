import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const RESULT_FILE = 'resultat.csv';
const IP_FILE = 'ip.txt';
const CONFIG_FILE = 'config.txt';
const HEADER = 'mention;Periode;Type Mention;ID;Timestamp;OfferId\n';
const PORT = Number(Deno.env.get('PORT') || 8000);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function textResponse(message: string, status = 200) {
  return new Response(message, { status, headers: CORS_HEADERS });
}

async function fileExists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return false;
    throw err;
  }
}

async function ensureResultFile() {
  if (await fileExists(RESULT_FILE)) {
    const stat = await Deno.stat(RESULT_FILE);
    if (stat.size === 0) {
      await Deno.writeTextFile(RESULT_FILE, HEADER);
    }
    return;
  }
  await Deno.writeTextFile(RESULT_FILE, HEADER);
}

async function readConfig() {
  try {
    const raw = await Deno.readTextFile(CONFIG_FILE);
    return JSON.parse(raw);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return {};
    console.warn('Unable to read config', err);
    return {};
  }
}

async function readIpSet() {
  const existing = new Set<string>();
  try {
    const content = await Deno.readTextFile(IP_FILE);
    content.split(/\r?\n/).forEach(line => {
      const ip = line.trim();
      if (ip) existing.add(ip);
    });
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      console.warn('Could not read ip file', err);
    }
  }
  return existing;
}

async function appendCsv(payload: Record<string, string>) {
  await ensureResultFile();
  const line = `${payload.mention || 'non'};${payload.periode || ''};${payload.mentionType || ''};${payload.ip || 'unknown'};${payload.timestamp || ''};${payload.offerId || ''}\n`;
  await Deno.writeTextFile(RESULT_FILE, line, { append: true });
}

async function appendIp(ip: string, existing: Set<string>) {
  if (!ip || ip === 'unknown' || existing.has(ip)) return;
  await Deno.writeTextFile(IP_FILE, ip + '\n', { append: true });
  existing.add(ip);
}

async function handleSubmit(req: Request) {
  let payload: Record<string, string>;
  try {
    payload = await req.json() as Record<string, string>;
  } catch (err) {
    return jsonResponse({ accepted: false, message: 'invalid json' }, 400);
  }
  const config = await readConfig();
  const blockAfterOne = Boolean(config.block_after_1);
  const ip = (payload.ip || 'unknown').toString();

  const existing = await readIpSet();
  if (blockAfterOne && ip !== 'unknown' && existing.has(ip)) {
    return jsonResponse({ accepted: false, message: 'blocked' }, 403);
  }

  await appendCsv(payload);
  await appendIp(ip, existing);
  return jsonResponse({ accepted: true });
}

console.log(`Collector server listening on http://0.0.0.0:${PORT}`);
serve((req) => {
  const url = new URL(req.url);
  if (req.method === 'OPTIONS') {
    return textResponse('', 200);
  }

  if (url.pathname === '/submit' && req.method === 'POST') {
    return handleSubmit(req);
  }

  if (url.pathname === '/ips' && req.method === 'GET') {
    return readIpSet().then(list => jsonResponse([...list]));
  }

  if (url.pathname === '/has_responded' && req.method === 'GET') {
    const ip = url.searchParams.get('ip') || '';
    if (!ip) return jsonResponse({ responded: false });
    return readIpSet().then(list => jsonResponse({ responded: list.includes(ip) }));
  }

  return textResponse('Not found', 404);
}, { port: PORT });

console.log(`Collector server listening on http://0.0.0.0:${PORT}`);
