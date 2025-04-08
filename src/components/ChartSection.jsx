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
    <div className="bg-olive-50 rounded-2xl shadow p-6 mt-6 border border-olive-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-olive-800">Entradas de Aceituna</h2>
          <p className="text-sm text-olive-600">Evolución mensual de entradas de aceituna en la campaña actual</p>
        </div>
        <div className="flex gap-2">
          {["Entradas", "Aceites"].map((name) => (
            <button
              key={name}
              className={`px-4 py-1 text-sm rounded-full border cursor-pointer transition-all duration-300 ${
                tab === name
                  ? "bg-olive-600 text-white border-olive-300"
                  : "bg-white text-olive-600 border-olive-200"
              }`}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d9d9d9" />
          <XAxis dataKey="name" stroke="#1f2615" />
          <YAxis stroke="#1f2615" />
          <Tooltip />
          <Bar dataKey="value" fill="#556339" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}