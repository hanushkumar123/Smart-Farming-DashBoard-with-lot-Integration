# Premium Smart Farming Dashboard 🌾

A futuristic, full-stack IoT application for real-time monitoring and smart farm management. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and a **Virtual IoT Simulator**.

## 🚀 Key Features

### 1. 📊 Premium Real-time Dashboard
-   **Hero Cards**: Gradient-styled animated cards for Soil Moisture, Temperature, Humidity, and Light.
-   **Live Status**: Pulse indicators for system connectivity and sensor health.
-   **Quick Actions**: Instant toggle for critical equipment (Irrigation Pump).

### 2. 🎮 Smart Command Center
-   **Interactive Controls**: Large, pulsing buttons for manual and AI-driven modes.
-   **Session Logging**: Real-time activity log tracking every user action.
-   **Mock Scheduling**: UI for setting automated operation timers.

### 3. 📈 Advanced Analytics
-   **Data Visualization**: Beautiful Area Charts for environmental trends using `Recharts`.
-   **Statistical Summary**: Auto-calculated averages and peak values.
-   **Export**: Download historical sensor data as CSV.

### 4. 🚨 System Alerts Center
-   **Management**: Filter alerts by severity (Critical, Warning, Info).
-   **Search**: Real-time keyword search for specific events.
-   **Visuals**: Color-coded cards for immediate risk assessment.

### 5. 🛠 Advanced Settings
-   **Personalization**: Toggle Measurement Units (Metric/Imperial) and Notifications.
-   **System**: Dark/Light mode preferences and Danger Zone controls.

---

## 🛠 Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion (Simulation), Recharts, React Icons, React Toastify.
-   **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication.
-   **IoT**: Custom Node.js Simulator (Virtual Device) or ESP32 C++ Firmware.

---

## 🏁 Getting Started

Follow these steps to run the full system locally.

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure MongoDB is running locally or update .env with Atlas URI
npm run dev
```
*Server runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*App runs on `http://localhost:3000`*

### 3. IoT Simulator (No Hardware Required)
Don't have an ESP32? No problem. Run our virtual device to simulate real-time sensor data.
```bash
# In the root directory
node iot/virtual_device.js
```
*This script sends random sensor data every 5 seconds and listens for pump commands.*

---

## 📱 Usage Guide

1.  **Register/Login**: Create an account to access the dashboard.
2.  **Monitor**: Watch the **Dashboard** for live updates from the simulator.
3.  **Control**: Go to the **Control Page** and click "Start Pump". Watch the terminal running `virtual_device.js` to see the command received.
4.  **Analyze**: Visit **Analytics** to see the data trends populate over time.

---

## 📂 Project Structure
-   `/backend`: API Routes, Models, Controllers.
-   `/frontend`: React Pages (Dashboard, Control, Analytics, etc.), Components.
-   `/iot`: `virtual_device.js` (Simulator) and `smart_farm_esp32.ino` (Hardware Code).
