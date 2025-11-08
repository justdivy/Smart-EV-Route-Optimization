import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const positions = {
  A: [28.6139, 77.2090], // Delhi
  B: [28.7041, 77.1025],
  C: [28.5355, 77.3910],
  D: [28.4595, 77.0266],
};

const stationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png",
  iconSize: [30, 30],
});

export default function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [battery, setBattery] = useState(8);
  const [result, setResult] = useState(null);

  const findRoute = async () => {
    if (!source || !destination) return alert("Please enter both Source and Destination!");
    const res = await fetch(`http://127.0.0.1:8000/route?source=${source}&destination=${destination}&battery=${battery}`);
    const data = await res.json();
    setResult(data);
  };

  const routePositions = result?.path ? result.path.map((n) => positions[n]) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/3 flex flex-col justify-center items-center p-8 space-y-6">
        <h1 className="text-4xl font-bold text-indigo-700 text-center">
          ⚡ Smart EV Charging Route Planner
        </h1>

        <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Source</label>
            <input
              className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-indigo-500 outline-none transition"
              placeholder="Enter Source (A, B, C, D)"
              value={source}
              onChange={(e) => setSource(e.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Destination</label>
            <input
              className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-indigo-500 outline-none transition"
              placeholder="Enter Destination (A, B, C, D)"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
            />
          </div>

          {/* Battery Range Slider */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Battery Range: {battery} units 🔋
            </label>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
              className="w-full accent-indigo-600"
            />
          </div>

          <button
            onClick={findRoute}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            Find Best Route
          </button>

          {result && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-gray-700">
              {result.error ? (
                <p className="text-red-500 font-semibold">{result.error}</p>
              ) : (
                <>
                  <p><strong>Path:</strong> {result.path.join(" → ")}</p>
                  <p><strong>Total Distance:</strong> {result.distance}</p>
                  <p><strong>Charging Stops:</strong> {result.charging_stops.join(", ")}</p>
                  <p><strong>Battery Left:</strong> {result.battery_left}</p>
                </>
              )}
            </div>
          )}
        </div>

        <footer className="text-sm text-gray-500 text-center pt-4">
          Designed By Divyansh Verma — Smart EV Route Optimization 🚗🔋
        </footer>
      </div>

      {/* Right Section - Map */}
      <div className="w-full md:w-2/3 p-4 flex items-center justify-center">
        <div className="w-full h-[500px] md:h-[600px] shadow-2xl rounded-2xl overflow-hidden border border-indigo-200">
          <MapContainer center={[28.6139, 77.2090]} zoom={10} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.entries(positions).map(([key, pos]) => (
              <Marker key={key} position={pos}>
                <Popup>{key}</Popup>
              </Marker>
            ))}
            {["B", "C"].map((station) => (
              <Marker key={station} position={positions[station]} icon={stationIcon}>
                <Popup>Charging Station: {station}</Popup>
              </Marker>
            ))}
            {routePositions.length > 1 && (
              <Polyline positions={routePositions} color="blue" weight={4} opacity={0.8} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
