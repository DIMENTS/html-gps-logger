# Real-Time Location and Temperature Logger

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

This project is a real-time location and temperature logger that uses Node.js, Express, and HTTPS for secure communication. It provides a web interface to visualize and store location and temperature data.

## Features

- Real-time location updates using Geolocation API
- Temperature data retrieval from OpenWeatherMap API
- Secure communication over HTTPS
- Data storage on the server using JSON files
- User-friendly web interface

## Requirements

- [Node.js](https://nodejs.org/) installed
- Certbot for SSL certificate (follow instructions in the Certbot section)
- API keys for Google Geocoding API and OpenWeatherMap API

## How It Works

1. **Geolocation**: The app uses the Geolocation API to get real-time location updates from the user's device.

2. **Temperature Retrieval**: It retrieves temperature data based on the current location from the OpenWeatherMap API.

3. **Secure Communication**: The server uses HTTPS to ensure secure communication between the client and the server.

4. **Data Storage**: Location and temperature data are stored on the server in JSON files.

## Certbot Setup

To enable HTTPS, you need to set up an SSL certificate using Certbot. Follow these steps:

1. Install Certbot on your server.
2. Run Certbot to obtain SSL certificates for your domain.
3. Update the `certbotPath` variable in the server code with the path to your SSL certificate files.

## Configuration

Before running the server, configure the following:

- API keys: Obtain API keys for Google Geocoding API and OpenWeatherMap API.
- Update the keys in the JavaScript file.

## Installation

1. Clone this repository.
2. Install dependencies using `npm install --production.bat`.
3. Run the server using `npm start.bat`.

## Usage

1. Open the web interface in a browser.
2. Allow geolocation access.
3. View real-time location and temperature updates.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
