# Vibrant Colors API

A minimal implementation of the [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) package as a web API that you can self-host with Docker.

It exposes a single HTTP endpoint that takes an image URL and returns the dominant color using the **Vibrant** algorithm.

## Features

- 🎨 Extracts the **Vibrant** swatch (with fallbacks to `DarkVibrant` / `Muted`)
- 🐳 Single-container Docker deployment, no external dependencies
- ⚡ Sub-100 ms response on typical album covers
- 🔌 Drops into Home Assistant via `rest_command`

## Quick start

```bash
docker run -d --name vibrant-colors -p 8765:8765 ghcr.io/PhoenixR49/vibrant-colors-api:latest
```

The API is now available at `http://localhost:8765`.

## Usage

### `GET /color`

Returns the dominant vibrant color for a given image URL.

| Parameter | Type   | Required | Description                 |
|-----------|--------|----------|-----------------------------|
| `url`     | string | yes      | URL of the image to analyze |

#### Example

```bash
curl "http://localhost:8765/color?url=https://resources.tidal.com/images/9b03b8d3/5a00/4b1b/8f91/dbafe02d83f5/320x320.jpg"
```

#### Response (200)

```json
{
    "rgb": [78, 115, 180],
    "hex": "#4e73b4"
}
```

#### Error responses

| Status | Meaning                          |
|--------|----------------------------------|
| 400    | `url` parameter missing          |
| 404    | No swatch could be extracted     |
| 500    | Image fetch / processing failure |

## Installation

### Option A — Pre-built image (recommended)

The image is published to the GitHub Container Registry. Pull and run it directly, no build required:

```bash
docker run -d --name vibrant-colors -p 8765:8765 --restart unless-stopped ghcr.io/PhoenixR49/vibrant-colors-api:latest
```

Or with Docker Compose:

```yaml
# docker-compose.yml
services:
  vibrant-colors:
    image: ghcr.io/PhoenixR49/vibrant-colors-api:latest
    container_name: vibrant-colors
    ports:
      - "8765:8765"
    restart: unless-stopped
```

```bash
docker compose up -d
```

### Option B — Build from source

Clone the repository and build the image locally:

```bash
git clone https://github.com/PhoenixR49/Vibrant-Colors-API vibrant-colors
cd vibrant-colors
docker build -t vibrant-colors .
docker run -d --name vibrant-colors -p 8765:8765 --restart unless-stopped vibrant-colors
```

### Option C — Run locally with Node

```bash
git clone https://github.com/PhoenixR49/Vibrant-Colors-API vibrant-colors
cd vibrant-colors
npm install
node app.mjs
```

## Home Assistant integration

Add a `rest_command` to `configuration.yaml`:

```yaml
rest_command:
  get_vibrant_color:
    url: "http://YOUR_DOCKER_IP:8765/color?url={{ image_url | urlencode }}"
    method: GET
```

> [!NOTE]
> If Home Assistant also runs in Docker on the **same host**, use `http://host.docker.internal:8765` (or place both containers on a shared Docker network and use the service name).

## Project structure

```
Vibrant-Colors-API/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── app.mjs
└── README.md
```

## License

MIT (see [LICENSE.md](LICENSE.md))