import React, { useEffect, useRef, useState } from 'react';
import { Camera, Play, Pause } from 'lucide-react';

interface Vehicle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  direction: 'horizontal' | 'vertical';
}

const CameraFeed: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [detectedCount, setDetectedCount] = useState(0);

  // Initialize vehicles
  useEffect(() => {
    const initialVehicles: Vehicle[] = [
      { id: 1, x: 50, y: 180, width: 40, height: 20, color: '#3B82F6', speed: 1, direction: 'horizontal' },
      { id: 2, x: 200, y: 160, width: 35, height: 18, color: '#EF4444', speed: 0.8, direction: 'horizontal' },
      { id: 3, x: 300, y: 50, width: 20, height: 40, color: '#10B981', speed: 1.2, direction: 'vertical' },
      { id: 4, x: 320, y: 250, width: 20, height: 40, color: '#F59E0B', speed: 0.9, direction: 'vertical' },
      { id: 5, x: 150, y: 200, width: 45, height: 22, color: '#8B5CF6', speed: 0.7, direction: 'horizontal' },
    ];
    setVehicles(initialVehicles);
    setDetectedCount(initialVehicles.length);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road infrastructure
      drawRoads(ctx, canvas.width, canvas.height);
      
      // Draw traffic lights
      drawTrafficLights(ctx);

      // Update and draw vehicles
      setVehicles(prevVehicles => {
        const updatedVehicles = prevVehicles.map(vehicle => {
          let newX = vehicle.x;
          let newY = vehicle.y;

          if (vehicle.direction === 'horizontal') {
            newX += vehicle.speed;
            if (newX > canvas.width + 50) {
              newX = -vehicle.width;
            }
          } else {
            newY += vehicle.speed;
            if (newY > canvas.height + 50) {
              newY = -vehicle.height;
            }
          }

          return { ...vehicle, x: newX, y: newY };
        });

        // Draw vehicles
        updatedVehicles.forEach(vehicle => {
          drawVehicle(ctx, vehicle);
          drawDetectionBox(ctx, vehicle);
        });

        return updatedVehicles;
      });

      // Draw UI overlay
      drawOverlay(ctx, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const drawRoads = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Horizontal road
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 150, width, 100);
    
    // Vertical road
    ctx.fillRect(280, 0, 100, height);
    
    // Road markings
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    
    // Horizontal road center line
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(width, 200);
    ctx.stroke();
    
    // Vertical road center line
    ctx.beginPath();
    ctx.moveTo(330, 0);
    ctx.lineTo(330, height);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const drawTrafficLights = (ctx: CanvasRenderingContext2D) => {
    // Traffic light pole
    ctx.fillStyle = '#6B7280';
    ctx.fillRect(270, 140, 5, 30);
    
    // Traffic light box
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(260, 130, 25, 15);
    
    // Lights
    ctx.fillStyle = '#EF4444'; // Red
    ctx.beginPath();
    ctx.arc(267, 135, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#10B981'; // Green
    ctx.beginPath();
    ctx.arc(275, 135, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawVehicle = (ctx: CanvasRenderingContext2D, vehicle: Vehicle) => {
    ctx.fillStyle = vehicle.color;
    ctx.fillRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
    
    // Add some detail to make it look more like a car
    ctx.fillStyle = '#1F2937';
    if (vehicle.direction === 'horizontal') {
      // Windows
      ctx.fillRect(vehicle.x + 5, vehicle.y + 3, vehicle.width - 10, vehicle.height - 6);
    } else {
      // Windows
      ctx.fillRect(vehicle.x + 3, vehicle.y + 5, vehicle.width - 6, vehicle.height - 10);
    }
  };

  const drawDetectionBox = (ctx: CanvasRenderingContext2D, vehicle: Vehicle) => {
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.strokeRect(vehicle.x - 2, vehicle.y - 2, vehicle.width + 4, vehicle.height + 4);
    
    // Detection label
    ctx.fillStyle = '#10B981';
    ctx.font = '10px Arial';
    ctx.fillText('DETECTED', vehicle.x, vehicle.y - 5);
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Status overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 80);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.fillText('AI TRAFFIC MONITORING', 20, 30);
    ctx.fillText(`Vehicles Detected: ${detectedCount}`, 20, 50);
    ctx.fillText('Status: ACTIVE', 20, 70);
    
    // Timestamp
    const now = new Date().toLocaleTimeString();
    ctx.fillText(`Time: ${now}`, 20, 85);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white border-opacity-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Python CV Live Feed</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm text-red-600 font-semibold">LIVE AI</span>
          </div>
        </div>
        <button
          onClick={togglePlayPause}
          className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 rounded-xl transition-all duration-300 border border-purple-200"
        >
          {isPlaying ? <Pause className="h-4 w-4 text-purple-600" /> : <Play className="h-4 w-4 text-purple-600" />}
          <span className="text-sm font-medium text-purple-700">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-auto bg-gray-900 rounded-xl border-2 border-purple-200 shadow-xl"
        />
        
        {/* Detection Stats Overlay */}
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-opacity-90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg border border-white border-opacity-20">
          <div className="text-xs space-y-1">
            <div className="font-semibold">🚗 Vehicles: {detectedCount}</div>
            <div className="font-semibold">🐍 Python CV: ON</div>
            <div className="font-semibold">📊 Accuracy: 98.5%</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
          <div className="text-lg font-bold text-green-700">{detectedCount}</div>
          <div className="text-xs text-green-600 font-medium">Python Detected</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
          <div className="text-lg font-bold text-blue-700">98.5%</div>
          <div className="text-xs text-blue-600 font-medium">ML Accuracy</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl border border-purple-200">
          <div className="text-lg font-bold text-purple-700">24/7</div>
          <div className="text-xs text-purple-600 font-medium">AI Monitoring</div>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;