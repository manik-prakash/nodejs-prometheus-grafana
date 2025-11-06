# Node.js + Prometheus + Grafana

## Overview
A Node.js (22‑alpine) Express server instrumented with prom-client and a `/metrics` endpoint, packaged with Prometheus and Grafana via Docker Compose for local monitoring.

Prometheus scrapes the app every 15 seconds, and Grafana runs with development credentials for quick setup.

## Features
* Express API with JSON endpoints and a Prometheus-compatible `/metrics` export path for scraping
* Middleware that records counters, gauges, and histograms with HTTP labels and millisecond-duration buckets
* Containerized stack (app, Prometheus, Grafana) with published ports for immediate access

## API endpoints
* `GET /metrics` — Exposes the prom-client registry with the correct content type for Prometheus scraping
* `GET /cpu` — Returns CPU models, speeds, load averages, total/free memory, uptime, process CPU usage, and process memory
* `GET /user` — Returns a mock user object after a 1‑second delay for testing latency and instrumentation

## Metrics emitted
* `http_requests_total` (Counter): labeled by method, route, and status_code to count all HTTP requests
* `active_requests` (Gauge): increments at request start and decrements on response finish to track concurrency
* `http_request_duration_ms` (Histogram): labeled by method, route, and code with buckets [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] ms

## Run with Docker Compose
This project includes a `docker-compose.yml` that defines three services: the Node server, Prometheus, and Grafana on a shared "monitoring" network.

Bring up the stack in the foreground (or add `-d` to run detached):

```bash
docker compose up 
# or
docker compose up -d 
```

After the stack is up, access services during development:
- Node app on `3000`
- Prometheus UI on `9090`
- Grafana UI on `3001` (admin/manik)

Prometheus mounts `prometheus.yml` and scrapes `server:3000` every 15s via the compose network.

## Local development (without Docker)
The container runs `npm run dev` and exposes port 3000; for local runs, install dependencies and use the same script.

Typical steps: `npm install` followed by `npm run dev` to mirror the Dockerfile's start behavior.

## Configuration files
* `Dockerfile`: Node 22‑alpine base, installs dependencies, copies sources, exposes 3000, runs npm run dev
* `docker-compose.yml`: Services (server, prometheus, grafana), ports 3000/9090/3001, Grafana admin credentials for development
* `prometheus.yml`: Global 15s scrape_interval and a node-app job scraping server:3000