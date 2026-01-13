# EduConnect 🎓

[![Flutter](https://img.shields.io/badge/Flutter-3.0%2B-blue?logo=flutter)](https://flutter.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.9%2B-yellow?logo=python)](https://www.python.org)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.0-363636?logo=solidity)](https://soliditylang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

**EduConnect** is a cutting-edge Education Management System that bridges the gap between traditional learning and modern technology. By integrating **Artificial Intelligence** for personalized learning paths and **Blockchain technology** for tamper-proof certification, EduConnect provides a secure, smart, and comprehensive ecosystem for students, teachers, and institutions.

## 🚀 Key Features

*   **📱 Mobile First Experience**: A cross-platform Flutter application for students and teachers to manage courses, assignments, and grades on the go.
*   **🤖 AI-Powered Recommendations**: An intelligent Python-based engine that analyzes user performance to suggest personalized courses and resources.
*   **⛓️ Blockchain Certification**: Secure issuance and verification of academic certificates using Ethereum smart contracts, ensuring credentials are immutable and globally verifiable.
*   **🔒 Secure Authentication**: Robust JWT-based authentication system managed by a scalable Node.js/Express backend.
*   **📂 Resource Management**: Efficient file sharing and resource organization for seamless collaboration.

## 🏗️ Architecture & Tech Stack

The project is structured as a monorepo containing the following services:

| Service | Directory | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **Mobile App** | [`/mobile`](./mobile) | Just Flutter, Riverpod, Dio | Cross-platform mobile client (iOS/Android/Web). |
| **Backend API** | [`/backend_express`](./backend_express) | Node.js, Express, MongoDB | Core REST API handling auth, users, and data. |
| **AI Engine** | [`/ai_service_python`](./ai_service_python) | Python, FastAPI/Flask, Scikit-learn | Machine learning service for course recommendations. |
| **Smart Contracts** | [`/blockchain`](./blockchain) | Solidity, Hardhat | Decentralized logic for certificate anchoring. |

## 🛠️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16+) & npm
*   [Python](https://www.python.org/) (v3.9+)
*   [Flutter SDK](https://flutter.dev/docs/get-started/install)
*   [Docker](https://www.docker.com/) (Optional, for containerized DB)

### 1. Backend Setup (Express)

```bash
cd backend_express
npm install

# Create .env file based on .env.example
cp .env.example .env

# Seed the database (Optional)
npm run seed

# Start the server
npm run dev
```

### 2. AI Service Setup (Python)

```bash
cd ai_service_python

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
```

### 3. Blockchain Setup (Hardhat)

```bash
cd blockchain
npm install

# Start local blockchain node
npx hardhat node

# Deploy contracts (in a separate terminal)
npx hardhat run scripts/deploy.ts --network localhost
```

### 4. Mobile App Setup (Flutter)

```bash
cd mobile

# Get dependencies
flutter pub get

# Generate code (if using build_runner)
flutter pub run build_runner build --delete-conflicting-outputs

# Run the app
flutter run
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the EduConnect Team.
