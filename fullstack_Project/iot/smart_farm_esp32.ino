#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ================= Config ================= //
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// REPLACE with your computer's IP address (e.g., 192.168.1.5) if running locally
const char* serverUrl = "http://192.168.1.100:5000/api"; 

// Pin Definitions
#define DHTPIN 4       // Digital Pin for DHT11/22
#define SOIL_PIN 34    // Analog Pin for Soil Moisture
#define LIGHT_PIN 35   // Analog Pin for LDR
#define WATER_PIN 32   // Analog Pin for Water Level
#define PUMP_PIN 2     // Digital Pin for Relay/Pump (Built-in LED often on Pin 2 too)

#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// Timers
unsigned long lastTime = 0;
unsigned long timerDelay = 5000; // 5 seconds

void setup() {
  Serial.begin(115200);

  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW); // Assume active HIGH relay, start OFF

  dht.begin();

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Connected to WiFi Network");
  Serial.println("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      
      // 1. Read Sensors
      float h = dht.readHumidity();
      float t = dht.readTemperature();
      int soilAnalog = analogRead(SOIL_PIN);
      int lightAnalog = analogRead(LIGHT_PIN);
      int waterAnalog = analogRead(WATER_PIN);

      // Check for sensor read fail
      if (isnan(h) || isnan(t)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
      }

      // Map Analog values to Percentage (Calibrate these based on your sensors)
      // ESP32 ADC is 12-bit (0-4095)
      // Soil: Dry ~4095, Wet ~0 (Usually inverted logic for resistive sensors)
      // Simplified mapping 0-4095 -> 0-100 logic (adjust as needed)
      int soilPct = map(soilAnalog, 4095, 0, 0, 100); 
      soilPct = constrain(soilPct, 0, 100);

      int lightVal = map(lightAnalog, 0, 4095, 0, 1000); // Lux approx
      int waterPct = map(waterAnalog, 0, 4095, 0, 100);

      // 2. Prepare JSON Payload
      String jsonPayload = "{";
      jsonPayload += "\"temperature\":" + String(t) + ",";
      jsonPayload += "\"humidity\":" + String(h) + ",";
      jsonPayload += "\"soilMoisture\":" + String(soilPct) + ",";
      jsonPayload += "\"light\":" + String(lightVal) + ",";
      jsonPayload += "\"waterLevel\":" + String(waterPct);
      jsonPayload += "}";

      // 3. Send Data (POST)
      HTTPClient http;
      String serverPath = String(serverUrl) + "/sensors";
      
      http.begin(serverPath);
      http.addHeader("Content-Type", "application/json");
      
      int httpResponseCode = http.POST(jsonPayload);
      
      if (httpResponseCode > 0) {
        Serial.print("Data Sent. Response: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      }
      http.end();

      // 4. Check Control Status (GET)
      String statusPath = String(serverUrl) + "/device/status";
      http.begin(statusPath);
      int httpCode = http.GET();
      
      if (httpCode > 0) {
        String payload = http.getString();
        // Simple manual parsing or use ArduinoJson library (Recommended)
        // Check for "isIrrigationOn":true
        bool turnOn = payload.indexOf("\"isIrrigationOn\":true") > 0;
        
        if (turnOn) {
            digitalWrite(PUMP_PIN, HIGH);
            Serial.println("Pump turned ON");
        } else {
            digitalWrite(PUMP_PIN, LOW);
             Serial.println("Pump turned OFF");
        }
      }
      http.end();

    } else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
