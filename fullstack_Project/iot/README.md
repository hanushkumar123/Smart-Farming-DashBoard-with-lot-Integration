# ESP32 Smart Farming Firmware

## Hardware Requirements
- ESP32 Development Board
- DHT11 or DHT22 Temperature/Humidity Sensor
- Soil Moisture Sensor (Capacitive recommended)
- LDR (Light Dependent Resistor) module
- Water Level Sensor
- Relay Module (to control pump/light)
- Jumper Wires & Breadboard

## Libraries Required
Install these from the Arduino Library Manager:
1. `DHT sensor library` by Adafruit
2. `Adafruit Unified Sensor`

## Configuration
1. Open `smart_farm_esp32.ino`.
2. Update `ssid` and `password` with your WiFi credentials.
3. Update `serverUrl` with your PC's local IP address (run `ipconfig` or `ifconfig` to find it). 
   - Example: `"http://192.168.1.5:5000/api"`
   - **Important**: Your PC and ESP32 must be on the same WiFi network.

## Pinout (Default)
- **DHT11**: GPIO 4
- **Soil Moisture**: GUIO 34 (Analog)
- **LDR**: GPIO 35 (Analog)
- **Water Level**: GPIO 32 (Analog)
- **Relay/Pump**: GPIO 2
