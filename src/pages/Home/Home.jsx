import StatCard from "@components/StatCard";
import ChartSection from "@components/ChartSection";
import clsx from "clsx";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

const Home = () => {
    const { theme } = useTheme(); // Usar el contexto del tema
    const { t } = useTranslation(); // Hook para traducciones
    const isDarkMode = theme === "dark";

    return (
        <div
            className={clsx(
                "p-6 space-y-6",
                isDarkMode ? "bg-dark-800 text-dark-50" : "bg-white text-olive-800"
            )}
        >
            <h1 className="text-2xl font-bold">{t("navigation.home")}</h1> {/* Traducción del título */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="home.active_members" // Clave de traducción para "Socios Activos"
                    value="245"
                    subtext="notifications.statusActive" // Clave de traducción para "+12% respecto al año anterior"
                />
                <StatCard
                    title="navigation.olive_entries" // Clave de traducción para "Entradas de Aceituna"
                    value="1,245 Tn"
                    subtext="home.olive_entries_growth" // Clave de traducción para "+5% respecto al año anterior"
                />
                <StatCard
                    title="home.oil_production" // Clave de traducción para "Producción de Aceite"
                    value="245,000 L"
                    subtext="home.oil_yield" // Clave de traducción para "Rendimiento medio: 19.7%"
                />
                <StatCard
                    title="home.pending_settlements" // Clave de traducción para "Liquidaciones Pendientes"
                    value="24"
                    subtext="home.total_value" // Clave de traducción para "Valor total: 125,400€"
                />
            </div>

            <ChartSection />
        </div>
    );
};

export default Home;