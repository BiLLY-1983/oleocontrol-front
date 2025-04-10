import StatCard from "@components/StatCard";
import ChartSection from "@components/ChartSection";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";

const Home = () => {
    const { theme } = useTheme(); // Usar el contexto del tema
    const isDarkMode = theme === "dark";

    return (
        <div
            className={clsx(
                "p-6 space-y-6",
                isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
            )}
        >
            <h1 className="text-2xl font-bold">Resumen</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Socios Activos"
                    value="245"
                    description="+12% respecto al año anterior"
                />
                <StatCard
                    title="Entradas de Aceituna"
                    value="1,245 Tn"
                    description="+5% respecto al año anterior"
                />
                <StatCard
                    title="Producción de Aceite"
                    value="245,000 L"
                    description="Rendimiento medio: 19.7%"
                />
                <StatCard
                    title="Liquidaciones Pendientes"
                    value="24"
                    description="Valor total: 125,400€"
                />
            </div>

            <ChartSection />
        </div>
    );
};

export default Home;