# 🛡️ HoneyShield - Advanced Web Honeypot

**HoneyShield** is a professional-grade, web-based honeypot system designed to detect and log unauthorized access attempts. Featuring a premium dark-mode interface, real-time attack monitoring, and dynamic service emulation, it provides a powerful tool for security researchers and network administrators.

![HoneyShield Dashboard Preview](https://via.placeholder.com/800x450.png?text=HoneyShield+Dashboard+Preview)

---

## 🚀 Key Features

*   **Premium Enterprise UI:** Sleek, responsive design with live status indicators and glassmorphism effects.
*   **Dynamic Configuration:** Add custom listeners on any port (SSH, FTP, HTTP, etc.) directly from the GUI.
*   **Real-Time Monitoring:** Watch attacks happen live with a detailed, auto-scrolling log table.
*   **Smart Bind Checking:** Automatic verification of port binding status with clear error reporting.
*   **Cross-Platform:** optimized for **Kali Linux** but fully compatible with Windows.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

*   **Git:** To download the project.
*   **Python 3.x:** For the backend server.
*   **Node.js & npm:** For the frontend interface.

---

## 🐧 Linux / Kali Linux Installation (Recommended)

Follow these steps to set up HoneyShield on a fresh Kali Linux environment:

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/Kripal-pv/honeypot.git
cd honeypot
```

### 2. Install Dependencies
We have provided an automated script to install all necessary Python and Node.js packages:
```bash
chmod +x install_kali.sh
./install_kali.sh
```

### 3. Run the Application
Start the HoneyShield system. Using `sudo` is required if you want to use ports below 1024 (like 21, 22, 80).
```bash
chmod +x run_honeypot.sh
sudo ./run_honeypot.sh
```

The application will launch automatically in your default browser at `http://localhost:5174`.

> **Note:** If you make changes or pull updates, you can run `./update.sh` to reinstall dependencies quickly.

---

## 🪟 Windows Installation

### 1. Clone the Repository
```powershell
git clone https://github.com/Kripal-pv/honeypot.git
cd honeypot
```

### 2. Install Dependencies manually
**Backend:**
```powershell
cd backend
pip install -r requirements.txt
cd ..
```

**Frontend:**
```powershell
cd frontend
npm install
cd ..
```

### 3. Run the Application
Simply double-click the `run_honeypot.bat` file, or run it from the command prompt:
```powershell
run_honeypot.bat
```

---

## 🎮 How to Use

1.  **Dashboard:** Upon launching, you will see the main dashboard. The system status will be **OFFLINE** initially.
2.  **Configuration:** 
    *   On the left panel, you can see active service configurations.
    *   Use the **Add Custom Listener** form to add new ports (e.g., Port `22` for SSH, Port `8080` for HTTP).
3.  **Activate System:**
    *   Click the large **ACTIVATE SYSTEM** button in the Control Panel.
    *   If successful, the status will change to **ACTIVE MONITORING** (Pulsing Green).
    *   If a port fails to bind (e.g., port 80 without sudo), an error message will appear.
4.  **Monitor Attacks:**
    *   Any connection attempts to your configured ports will appear instantly in the **Live Attack Feed**.
    *   You can clear the logs or refresh the view at any time.

---

## ⚠️ Troubleshooting

*   **"Failed to bind port..." Error:**
    *   This usually means you are trying to use a privileged port (below 1024) without root privileges of Administrator rights.
    *   **Fix:** Run the script with `sudo` (Linux) or as Administrator (Windows).
*   **"Address already in use":**
    *   Another service (like a real SSH server or Apache) is already running on that port.
    *   **Fix:** Stop the conflicting service or choose a different port (e.g., 2222 instead of 22).

---

## 📜 License
This project is for educational and defensive purposes only. Use responsibly.
