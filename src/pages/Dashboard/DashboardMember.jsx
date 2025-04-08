import Sidebar from "@components/Sidebar";
import Topbar from "@components/Topbar";
import StatCard from "@components/StatCard";
import ChartSection from "@components/ChartSection";

const DashboradMember = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Socio</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Socios Activos" value="245" description="+12% respecto al año anterior" />
            <StatCard title="Entradas de Aceituna" value="1,245 Tn" description="+5% respecto al año anterior" />
            <StatCard title="Producción de Aceite" value="245,000 L" description="Rendimiento medio: 19.7%" />
            <StatCard title="Liquidaciones Pendientes" value="24" description="Valor total: 125,400€" />
          </div>

          <ChartSection />
        </main>
      </div>
    </div>
  );
};

export default DashboradMember;
