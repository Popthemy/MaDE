# MassDesign: The Pro-Automation Template Engine 🎨

MassDesign is a high-performance, browser-based automation tool designed for Rapid Graphic Production. Built for churches, schools, teams, and creators who need to generate hundreds of personalized visuals from a single template without the bloat of traditional design software.

## 🚀 Core Features

- **Automated Mass Generation**: Transform single templates into hundreds of variations using CSV/Excel data.
- **Intelligent Rendering Engine**:
    - **Adaptive Typography**: Automatic text shrinking and fitting heuristics.
    - **Dynamic Image Pipelines**: Smart "Cover" and "Fit" logic for user-provided URLs.
- **Vertical Integration**: Optimized for single-page efficiency with a low-latency React/Konva canvas.
- **Offline-First PWA Capabilities**: Built to handle low-connectivity environments with graceful degradation.
- **Hardware-Aware Design**: High-contrast UI for readability in various lighting conditions.

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Canvas Engine**: HTML5 Canvas via `react-konva`
- **Styling**: Tailwind CSS
- **Animations**: `motion/react`
- **Data Orchestration**: Standardized MassDesign Schema (MDS)

## 📖 Key Workflows

### 1. The Designer
Map UI elements to Data Keys. Use "Sync to Label" to maintain clean mappings. Supports frames, overlays, and background textures.

### 2. Batch Processing
The Data Panel highlights missing or invalid fields using real-time validation logic. Supports manual entry and CSV bulk uploads.

### 3. Smart Export
MassDesign generates unique download packages with optimized naming conventions based on your data keys.

## 🇳🇬 Local Context & Efficiency
Designed with the "Africa Context" in mind: 
- Lightweight assets for low data consumption.
- Visual impact designed for mobile/PWA first consumption.
- Robust error handling for "Missing Insufficient Permissions" and Quota overflows.

## 📄 License
© 2026 Zoho Principal Systems Architect - MassDesign Pro.
Proudly built for the Google I/O Extended pitch.
