// src/components/ChartSection.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const data = [
  { name: "Ene", value: 410 },
  { name: "Feb", value: 310 },
  { name: "Mar", value: 200 },
  { name: "Abr", value: 280 },
  { name: "May", value: 180 },
  { name: "Jun", value: 240 },
];

export default function ChartSection() {
  const [tab, setTab] = useState("Entradas");

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-green-900">Entradas de Aceituna</h2>
          <p className="text-sm text-gray-500">Evolución mensual de entradas de aceituna en la campaña actual</p>
        </div>
        <div className="flex gap-2">
          {["Entradas", "Aceites"].map((name) => (
            <button
              key={name}
              className={`px-4 py-1 text-sm rounded-full border ${tab === name ? "bg-green-100 text-green-800 border-green-200" : "bg-white text-gray-500 border-gray-200"}`}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#14532d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
