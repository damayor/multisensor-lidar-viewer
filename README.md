# Multi-Sensor Viewer: Autonomous Driving Data Visualization

A comprehensive research exploration into real-time 3D sensor data visualization using React, Three.js, and react-three-fiber with the open-source nuScenes dataset.

## Overview

This project demonstrates an advanced full-stack application for interactive autonomous driving sensor data exploration. It combines a **React + react-three-fiber frontend** for real-time 3D visualization with a **FastAPI backend** serving the nuScenes dataset.

The implementation showcases best practices in web computer graphics, clean architecture, type safety, scalability, and seamless frontend-backend integration—serving as a practical learning platform for visual computing with Three.js and React Three Fiber.

## Author

- David Mayorga-Herrera - [Website](https://mayinteractive.io/)

---

## Build

### Frontend Stack
- **Vite** + **React 19** + **TypeScript**
- **react-three/fiber (R3F)** for 3D rendering
- **Three.js** for 3D graphics
- **TailwindCSS** for styling
- **pnpm** as package manager

### Backend Stack
- **FastAPI** - Modern async Python web framework
- **Uvicorn** - ASGI server
- **nuScenes-devkit** - Official dataset SDK

---

## Gallery

**1 - Default Viewer**            
![Default Viewer](multisensor-viewer/public/images/01.png)  

**2 - Multi-Camera Integration**
![Multi-Camera](multisensor-viewer/public/images/02.png)

**3 - LIDAR Point Cloud + Annotation Boxes**          
![LIDAR with Boxes](multisensor-viewer/public/images/03.png)  

**4 - Data Quality Errors Visualization**
 ![Errors Rendered](multisensor-viewer/public/images/04.png)

---

## Project Setup

### Requirements

Before starting, ensure you have installed:

- **Node.js** (v18 or higher) and **pnpm** for the frontend
- **Python** (v3.8 or higher) for the backend
- **Linux** or **WSL (Windows Subsystem for Linux)** is recommended
  - On Windows, WSL2 is strongly recommended for better performance with large dataset operations
  - Windows native is not recommended due to file path handling with the dataset

### Download Dataset

1. Create a free account at https://www.nuscenes.org/sign-up
2. Download **nuScenes mini** (v1.0-mini) - ~4 GB
3. Extract all archives into `nuscenes-api/data/nuscenes/`


### Project Structure

```
multisensor-lidar-viewer/
├── nuscenes-api/                 # Backend - REST API Layer
│   ├── main.py                   # FastAPI application
│   ├── config.py                 # Configuration and settings
│   ├── database.py               # nuScenes SDK initialization
│   ├── requirements.txt          # Python dependencies
│   ├── routers/
│   │   ├── scenes.py            # Scene endpoints
│   │   ├── samples.py           # Sample/Frame endpoints
│   │   ├── sensor_data.py       # Sensor data endpoints
│   │   └── quality.py           # Data quality inspection
│   └── data/
│       └── nuscenes/            # ← nuScenes dataset location
│
└── multisensor-viewer/           # Frontend - 3D Visualization
    ├── src/
    │   ├── components/
    │   │   ├── three/           # Three.js & R3F components
    │   │   │   ├── LidarViewer.tsx
    │   │   │   ├── PointCloud.tsx
    │   │   │   └── AnnotationBoxes.tsx
    │   │   └── ui/              # React UI components
    │   │       ├── SimulationPanel.tsx
    │   │       ├── Timeline.tsx
    │   │       └── SensorChip.tsx
    │   ├── config/
    │   ├── utils/
    │   └── App.tsx
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

---

## How to Run

### Backend Setup & Execution

1. **Install Python dependencies:**
   ```bash
   cd nuscenes-api
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Start the FastAPI server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   - API will be available at `http://localhost:8000`
   - Interactive docs at `http://localhost:8000/docs` with Swagger
   - The dataset will be loaded automatically on startup

### Frontend Setup & Execution

1. **Install dependencies:**
   ```bash
   cd multisensor-viewer
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```
   - Application will be available at `http://localhost:5173` (default Vite port)
   - Hot module reloading enabled for development

3. **Debug Mode - Research & Testing**:
   Enable debug mode to access quality metrics and sensor degradation simulation:
   ```bash
   pnpm dev:debug
   ```
   - Displays quality status badge in the header
   - Enables SimulationPanel for testing data edge cases
   - Visualize missing annotations and sensor data gaps
   - Useful for exploring dataset limitations and quality scenarios

4. **Build for production:**
   ```bash
   pnpm build
   ```
   - Production build output goes to `dist/`



## What I've Developed

### Backend - NuScenes API Service

1. **RESTful API Endpoints**:
   - Scene management: List and retrieve comprehensive scene metadata
   - Frame/Sample access: Get frame data with associated multi-sensor information
   - Sensor data streaming: LIDAR point clouds, multi-camera imagery, RADAR data

2. **Data Integrity & Quality Analysis**:
   - Comprehensive validation of sample data structure and completeness
   - Detection of temporal inconsistencies and missing sensor annotations
   - Dataset anomaly detection for research and debugging

3. **Robust Error Handling**:    
   - Edge case handling for missing or incomplete sensor data
   - Graceful API error responses for client-side consumption

### Frontend - Multi-Sensor Viewer

1. **3D Point Cloud Visualization**:
   - LIDAR point cloud rendering optimized for high-density data
   - Interactive camera controls with smooth navigation (OrbitControls)
   - GPU-accelerated rendering using Three.js

2. **Multi-Camera Integration**:
   - Synchronized display of multiple camera feeds
   - Sensor selection interface for switching between data streams

3. **Scene Navigation & Control**:
   - Interactive scene and frame selection with metadata
   - Real-time API integration for dynamic data loading

4. **Sensor Data Monitoring**:
   - Interactive sensor status indicators
   - Data availability and quality metrics per sensor

5. **Temporal Playback & Navigation**: 
   - Frame-by-frame sequence playback through driving scenes
   - Timeline controls for exploration

6. **3D Annotation Rendering**:
   - Bounding box visualization for detected objects
   - World-space coordinate alignment with point cloud data

7. **Data Quality Visualization**:
   - Interactive exploration of sensor degradation scenarios
   - Visual feedback for missing annotations or data gaps
   - Research-focused tools for understanding dataset limitations

8. **Production Code Quality**:
   - Full TypeScript with strict mode enabled
   - ESLint + Prettier for consistent code standards
   - Modular, extensible component architecture

---

## Development Notes

- **Architecture**: Backend API on port 8000, frontend dev server on 5173
- **Rendering Pipeline**: GPU-accelerated graphics using Three.js and WebGL
- **State Management**: React hooks for functional, side-effect-driven component architecture
- **Development Tools**: IDE support and scaffolding with Vite, TypeScript, ESLint, and Prettier
- **Data Source**: Open-source nuScenes dataset (v1.0-mini for development/research)
- **Data Quality Exploration**: Educational visualization of edge cases, missing data, and sensor anomalies

---

## Future Enhancements

- Unit and integration tests using @react-three/test-renderer
- Enhanced RADAR visualization with custom point cloud rendering
- Interactive 3D annotation controls (select boxes, modify attributes)
- TailwindCSS theme optimization with design tokens
- Performance profiling and WebGL optimization techniques
- Advanced camera manipulation and data filtering capabilities

---

## Design Philosophy

This research project emphasizes:

- **Visual Clarity**: Modular, well-organized component structure
- **Type Safety**: Full TypeScript coverage with strict compiler options
- **Extensibility**: Pluggable backend routers and composable React components
- **Learning Value**: Practical exploration of 3D graphics, sensor fusion concepts, and real-time data visualization
- **Modern Best Practices**: Contemporary patterns in Python (FastAPI), TypeScript, and React ecosystems
