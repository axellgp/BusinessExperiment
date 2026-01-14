#!/usr/bin/env python3
"""
Simple collector server to receive experiment submissions.
Listens on 0.0.0.0:8000 by default. Endpoints:
- POST /submit  -> JSON payload {ip, offerId, periode, mention, mentionType, timestamp}
- GET /ips     -> returns JSON array of known IPs
- GET /has_responded?ip=1.2.3.4 -> returns JSON {responded: true/false}

It appends results to `resultat.txt` (semicolon-separated) and unique IPs to `ip.txt`.
"""

import http.server
import socketserver
import json
import urllib.parse
import os

PORT = 8000
RESULT_FILE = 'resultat.txt'
IP_FILE = 'ip.txt'
CONFIG_FILE = 'config.txt'

class Handler(http.server.SimpleHTTPRequestHandler):
    def _set_json(self, code=200):
        self.send_response(code)
        self.send_header('Content-Type','application/json')
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers','Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_json(200)
        self.wfile.write(b'{}')

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/ips':
            ips = []
            if os.path.exists(IP_FILE):
                with open(IP_FILE,'r',encoding='utf-8') as f:
                    ips = [l.strip() for l in f if l.strip()]
            self._set_json(200)
            self.wfile.write(json.dumps(ips).encode())
            return
        if parsed.path == '/has_responded':
            q = urllib.parse.parse_qs(parsed.query)
            ip = q.get('ip',[''])[0]
            found = False
            if ip and os.path.exists(IP_FILE):
                with open(IP_FILE,'r',encoding='utf-8') as f:
                    found = any(ip == l.strip() for l in f)
            self._set_json(200)
            self.wfile.write(json.dumps({'responded': found}).encode())
            return
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != '/submit':
            self._set_json(404)
            self.wfile.write(json.dumps({'error':'not found'}).encode())
            return
        length = int(self.headers.get('Content-Length',0))
        raw = self.rfile.read(length).decode('utf-8')
        try:
            data = json.loads(raw)
        except Exception as e:
            self._set_json(400)
            self.wfile.write(json.dumps({'accepted':False,'message':'bad json'}).encode())
            return

        # read server config to know if block_after_1 is enabled
        block_after = False
        try:
            if os.path.exists(CONFIG_FILE):
                with open(CONFIG_FILE,'r',encoding='utf-8') as f:
                    cfg = json.load(f)
                    block_after = bool(cfg.get('block_after_1', False))
        except Exception:
            block_after = False

        ip = data.get('ip','unknown')
        # Check block
        if block_after and os.path.exists(IP_FILE):
            with open(IP_FILE,'r',encoding='utf-8') as f:
                for l in f:
                    if l.strip() == ip:
                        self._set_json(403)
                        self.wfile.write(json.dumps({'accepted':False,'message':'blocked'}).encode())
                        return
        # Append result
        mention = data.get('mention','non')
        periode = data.get('periode','')
        mentionType = data.get('mentionType','')
        timestamp = data.get('timestamp','')
        offerId = data.get('offerId','')
        line = f"{mention};{periode};{mentionType};{ip};{timestamp};{offerId}\n"
        try:
            with open(RESULT_FILE,'a',encoding='utf-8') as f:
                # if file empty, write header
                if os.path.getsize(RESULT_FILE) == 0:
                    f.write('mention;Periode;Type Mention;ID;Timestamp;OfferId\n')
                f.write(line)
            # update ip list
            if ip and ip != 'unknown':
                existing = set()
                if os.path.exists(IP_FILE):
                    with open(IP_FILE,'r',encoding='utf-8') as f:
                        existing = set(l.strip() for l in f if l.strip())
                if ip not in existing:
                    with open(IP_FILE,'a',encoding='utf-8') as f:
                        f.write(ip + '\n')
            self._set_json(200)
            self.wfile.write(json.dumps({'accepted':True}).encode())
        except Exception as e:
            self._set_json(500)
            self.wfile.write(json.dumps({'accepted':False,'message':str(e)}).encode())

if __name__ == '__main__':
    print(f"Starting collector server on port {PORT} (http://0.0.0.0:{PORT})")
    with socketserver.ThreadingTCPServer(('', PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Shutting down')
            httpd.shutdown()
