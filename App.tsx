import React, { useState, useEffect } from 'react';
import CameraFeed from './components/CameraFeed';
import { 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Car,
  MessageCircle,
  X,
  Send,
  RefreshCw,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';

interface TrafficData {
  density: string;
  signal: string;
  wait_time: string;
  vehicles: number;
  location: [number, number];
  junction_name: string;
  description: string;
}

interface Violation {
  type: string;
  location: string;
  time: string;
}

interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: string;
}

function App() {
  const [trafficData, setTrafficData] = useState({
    junction1: {
      density: 'Medium',
      signal: 'yellow',
      wait_time: '45 seconds',
      vehicles: 23,
      location: [28.6139, 77.2090] as [number, number],
      junction_name: 'Connaught Place',
      description: 'Major commercial hub with high pedestrian and vehicle traffic'
    },
    junction2: {
      density: 'Low',
      signal: 'red',
      wait_time: '30 seconds',
      vehicles: 15,
      location: [28.5355, 77.3910] as [number, number],
      junction_name: 'India Gate Circle',
      description: 'Tourist area with moderate traffic flow and ceremonial importance'
    },
    junction3: {
      density: 'High',
      signal: 'green',
      wait_time: '60 seconds',
      vehicles: 45,
      location: [28.6692, 77.4538] as [number, number],
      junction_name: 'Akshardham Temple',
      description: 'Religious site with heavy weekend traffic and tour buses'
    },
    junction4: {
      density: 'Medium',
      signal: 'yellow',
      wait_time: '40 seconds',
      vehicles: 32,
      location: [28.6304, 77.2177] as [number, number],
      junction_name: 'Red Fort Junction',
      description: 'Historical area with mixed commercial and tourist traffic'
    }
  });

  const [violations, setViolations] = useState<Violation[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      text: "Hello! I'm your AI traffic assistant powered by Python ML algorithms. How can I help you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateTrafficData();
      updateViolations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateTrafficData = () => {
    const densities = ['Low', 'Medium', 'High'];
    const signals = ['red', 'yellow', 'green'];
    
    setTrafficData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        const junction = updated[key as keyof typeof updated];
        updated[key as keyof typeof updated] = {
          ...junction,
          density: densities[Math.floor(Math.random() * densities.length)],
          signal: signals[Math.floor(Math.random() * signals.length)],
          vehicles: Math.floor(Math.random() * 50) + 10,
          wait_time: `${Math.floor(Math.random() * 60) + 20} seconds`
        };
      });
      return updated;
    });
  };

  const updateViolations = () => {
    const violationTypes = [
      'Speed limit exceeded',
      'Red light violation',
      'Illegal parking',
      'Lane violation',
      'No helmet detected',
      'Wrong way driving',
      'Mobile phone usage'
    ];
    
    const junctions = ['Connaught Place', 'India Gate Circle', 'Akshardham Temple', 'Red Fort Junction'];
    
    if (Math.random() > 0.6) {
      const newViolation: Violation = {
        type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
        location: junctions[Math.floor(Math.random() * junctions.length)],
        time: new Date().toLocaleTimeString()
      };
      
      setViolations(prev => [newViolation, ...prev.slice(0, 5)]);
    }
  };

  const handleOptimizeSignals = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTrafficData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key as keyof typeof updated] = {
            ...updated[key as keyof typeof updated],
            signal: 'green',
            wait_time: '60 seconds',
            density: 'Optimized'
          };
        });
        return updated;
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleEmergencyOverride = () => {
    setTrafficData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key, index) => {
        updated[key as keyof typeof updated] = {
          ...updated[key as keyof typeof updated],
          signal: index === 0 ? 'green' : 'red',
          wait_time: '0 seconds',
          density: 'Emergency'
        };
      });
      return updated;
    });
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const userMessage: ChatMessage = {
      text: messageInput,
      isBot: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setMessageInput('');

    // Simulate Python AI response
    setTimeout(() => {
      const responses = [
        "Python ML models are analyzing traffic patterns in real-time using TensorFlow and OpenCV.",
        "Current traffic density is being processed by our Decision Tree algorithm trained on Delhi traffic data.",
        "Emergency protocols activated! Python scripts are coordinating with traffic control systems.",
        "Traffic signals optimized using Python-based reinforcement learning algorithms.",
        "Computer vision models detect violations with 98.5% accuracy using YOLO and Python.",
        "Historical traffic data from Delhi junctions is being analyzed using Pandas and NumPy.",
        "Real-time predictions generated by our Python-based neural network models."
      ];

      const botMessage: ChatMessage = {
        text: responses[Math.floor(Math.random() * responses.length)],
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'red': return 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200';
      case 'yellow': return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-200';
      case 'green': return 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-200';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-200';
    }
  };

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'High': return 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border-red-200';
      case 'Medium': return 'text-yellow-700 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-700 bg-gradient-to-r from-green-50 to-green-100 border-green-200';
      case 'Emergency': return 'text-purple-700 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200';
      case 'Optimized': return 'text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-700 to-blue-800 shadow-2xl border-b border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                AI Traffic Management System
              </h1>
              <p className="text-cyan-200 text-lg mt-2">Powered by Python Machine Learning & Computer Vision</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2 text-sm text-cyan-200">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                  <span>Python Backend Active</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-cyan-200">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg"></div>
                  <span>ML Models Running</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-sm">Delhi Traffic Network</div>
              <div className="text-cyan-200 text-xs">4 Major Junctions Monitored</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Junction Information Panel */}
        <div className="bg-gradient-to-r from-slate-600 to-blue-700 rounded-2xl shadow-2xl p-8 mb-8 text-white hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MapPin className="h-6 w-6 mr-2" />
            Monitored Junctions - Delhi, India
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(trafficData).map(([key, data], index) => (
              <div key={key} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-20 hover:scale-105 transition-all duration-300 cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">{data.junction_name}</h3>
                <p className="text-cyan-100 text-sm mb-2">{data.description}</p>
                <div className="flex items-center text-xs text-cyan-200">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>24/7 Monitoring</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-6 mb-8 hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Python AI Control Panel
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={updateTrafficData}
              className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-opacity-30 hover:scale-110 transition-all duration-300 border border-white border-opacity-30"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Update Traffic Data</span>
            </button>
            <button
              onClick={handleOptimizeSignals}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-110 transition-all duration-300 disabled:opacity-50 shadow-lg"
            >
              <TrendingUp className="h-5 w-5" />
              <span>{isLoading ? 'Optimizing with Python...' : 'AI Signal Optimization'}</span>
            </button>
            <button
              onClick={handleEmergencyOverride}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <Shield className="h-5 w-5" />
              <span>Emergency Override</span>
            </button>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Traffic Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Junction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(trafficData).map(([key, data], index) => (
                <div key={key} className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white border-opacity-50 hover:scale-105 hover:shadow-3xl transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {data.junction_name}
                      </h3>
                      <p className="text-sm text-gray-600">Junction {index + 1}</p>
                    </div>
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-full ${getSignalColor(data.signal)} shadow-2xl animate-pulse`}></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Density:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDensityColor(data.density)}`}>
                        {data.density}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Wait Time:</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-gray-800">{data.wait_time}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Vehicles:</span>
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-green-500" />
                        <span className="font-semibold text-gray-800">{data.vehicles}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Camera Feed */}
            <CameraFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Python ML Model Info */}
            <div className="bg-gradient-to-br from-slate-600 to-indigo-600 rounded-2xl shadow-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Python ML Models
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">TensorFlow Neural Network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">OpenCV Computer Vision</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">YOLO Object Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Scikit-learn Decision Tree</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
                <p className="text-xs text-blue-100">
                  <strong>Python Libraries:</strong> NumPy, Pandas, Matplotlib for data analysis and visualization
                </p>
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white border-opacity-50 hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                System Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(trafficData).reduce((sum, junction) => sum + junction.vehicles, 0)}
                  </div>
                  <div className="text-xs text-blue-700">Total Vehicles</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600">98.5%</div>
                  <div className="text-xs text-emerald-700">ML Accuracy</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                  <div className="text-2xl font-bold text-slate-600">24/7</div>
                  <div className="text-xs text-slate-700">Monitoring</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{violations.length}</div>
                  <div className="text-xs text-amber-700">Active Alerts</div>
                </div>
              </div>
            </div>

            {/* Recent Violations */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white border-opacity-50 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">AI Detected Violations</h3>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {violations.length > 0 ? (
                  violations.map((violation, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-red-800">{violation.type}</p>
                          <p className="text-xs text-red-600 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {violation.location}
                          </p>
                        </div>
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                          {violation.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent violations detected</p>
                    <p className="text-xs text-gray-400">Python AI monitoring active</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional System Info - Fills bottom right space */}
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl shadow-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Health
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU Usage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-white bg-opacity-20 rounded-full">
                      <div className="w-3/4 h-full bg-emerald-400 rounded-full"></div>
                    </div>
                    <span className="text-xs">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memory</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-white bg-opacity-20 rounded-full">
                      <div className="w-1/2 h-full bg-amber-400 rounded-full"></div>
                    </div>
                    <span className="text-xs">50%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Network</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-2xl hover:from-blue-700 hover:to-cyan-700 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-96 flex flex-col border border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-2xl">
              <div>
                <h3 className="text-lg font-semibold">Python AI Assistant</h3>
                <p className="text-xs text-cyan-100">Powered by Machine Learning</p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow-lg ${
                      message.isBot
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 opacity-75`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about traffic or Python ML models..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;