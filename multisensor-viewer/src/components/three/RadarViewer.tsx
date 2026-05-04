import { type FC, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { PointCloud } from "./PointCloud";
import type { Point3D, SensorInfo, RadarSensorData } from "../../interfaces/types";
import {
  CAMERA_INITIAL_POSITION,
  LIGHT_INTENSITY,
  ZOOM_MAX,
  ZOOM_MIN,
} from "@config/three-scene";
import { parsePCDBin } from "@utils/pcdParser";
import { API } from "@config/constants";

interface RadarViewerProps {
  sensors: Record<string, SensorInfo>;
}

export const RadarViewer: FC<RadarViewerProps> = ({ sensors }) => {
  const [selectedRadarChannel, setSelectedRadarChannel] = useState<string | null>(null);
  const [radarPoints, setRadarPoints] = useState<Point3D[] | null>(null);
  const [radarData, setRadarData] = useState<RadarSensorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get available radar sensors
  const radarSensors = Object.keys(sensors).filter((ch) =>
    ch.startsWith("RADAR")
  );

  // Set default radar sensor on mount
  useEffect(() => {
    if (radarSensors.length > 0 && !selectedRadarChannel) {
      setSelectedRadarChannel(radarSensors[0]);
    }
  }, [radarSensors, selectedRadarChannel]);

  // Fetch and parse radar data when selected channel changes
  useEffect(() => {
    if (!selectedRadarChannel || !sensors[selectedRadarChannel]) {
      setRadarPoints(null);
      setRadarData(null);
      setError(null);
      return;
    }

    const radarSensorInfo = sensors[selectedRadarChannel];
    const sample_data_token = radarSensorInfo.sample_data_token;

    setLoading(true);
    setError(null);
    setRadarPoints(null);

    // Fetch radar sensor metadata
    fetch(`${API}/sensor-data/${sample_data_token}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<RadarSensorData>;
      })
      .then((data) => {
        setRadarData(data);

        // Fetch and parse the PCD file
        if (data.filename) {
          return fetch(`${API}/data/${data.filename}`).then((r) => {
            if (!r.ok) throw new Error(`Failed to load PCD file: HTTP ${r.status}`);
            return r.arrayBuffer();
          });
        }
        throw new Error("No filename provided");
      })
      .then((buffer) => parsePCDBin(buffer))
      .then((points) => {
        setRadarPoints(points);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load radar data");
        setRadarPoints([]);
        setLoading(false);
      });
  }, [selectedRadarChannel, sensors]);

  if (radarSensors.length === 0) {
    return (
      <div className="flex items-center justify-center h-120 bg-[#050810]">
        <span className="text-[#636e7b] text-xs font-mono">
          No RADAR sensors available for this frame
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-120 bg-[#050810] gap-4">
        <div className="text-center px-8">
          <div className="text-red-400 font-bold font-mono text-sm">ERROR</div>
          <div className="text-[#636e7b] text-xs mt-2 max-w-xs leading-relaxed">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-120 bg-[#050810] flex-col gap-3">
        <div className="w-6 h-6 border-2 border-[#1c2532] border-t-cyan-400 rounded-full animate-spin" />
        <span className="text-[#636e7b] text-xs font-mono">
          Loading RADAR data...
        </span>
      </div>
    );
  }

  if (!radarPoints || radarPoints.length === 0) {
    return (
      <div className="flex items-center justify-center h-120 bg-[#050810]">
        <span className="text-[#636e7b] text-xs font-mono">
          No RADAR points for this frame
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-120 bg-[#050810] flex flex-col">
      {/* Radar selector dropdown */}
      <div className="relative bottom-1 right-1 px-4 py-3 border-b border-[#1c2532] shrink-0 flex items-center gap-3 justify-end">
        <label htmlFor="radar-select" className="text-[11px] font-bold tracking-widest uppercase text-[#636e7b]">
          RADAR Sensor:
        </label>
        <select
          id="radar-select"
          value={selectedRadarChannel || ""}
          onChange={(e) => setSelectedRadarChannel(e.target.value)}
          className="px-3 py-1.5 bg-[#0d1117] border border-[#1c2532] rounded text-[11px] text-cyan-400 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          {radarSensors.map((ch) => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1">
        <Canvas
          camera={{
            position: CAMERA_INITIAL_POSITION,
            fov: 60,
            near: 0.1,
            far: 1000,
          }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "#050810" }}
        >
          <ambientLight intensity={LIGHT_INTENSITY} />
          <PointCloud points={radarPoints} />

          <GizmoHelper alignment={"top-right"}>
            <GizmoViewport />
          </GizmoHelper>
          <Grid
            args={[120, 120]}
            cellSize={2}
            cellColor="#1c2532"
            sectionSize={10}
            sectionColor="#2d3f55"
            fadeDistance={90}
            position={[0, 0, -3]}
          />
          <OrbitControls
            makeDefault
            enableDamping
            minDistance={ZOOM_MIN}
            maxDistance={ZOOM_MAX}
          />
        </Canvas>
      </div>

      {/* HUD overlays */}
      <div className="absolute top-3 left-3 text-[10px] font-mono text-[#636e7b] pointer-events-none leading-relaxed">
        <span className="text-orange-400">{selectedRadarChannel}</span> ·{" "}
        {radarPoints.length.toLocaleString()} pts
        {radarData && (
          <>
            <br />
            <span className="text-[#2d3f55]">
              ts: {new Date(radarData.timestamp / 1000).toISOString()}
            </span>
          </>
        )}
      </div>
      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-[#636e7b] pointer-events-none text-right leading-loose">
        Left drag → rotate
        <br />
        Right drag → pan
        <br />
        Scroll → zoom
      </div>
    </div>
  );
};
