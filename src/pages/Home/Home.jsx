import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext/UserContext.jsx';
import { getEntriesUrl } from '../../utils/permissions/entryPermissions.js';
import { getAnalysesUrl } from '../../utils/permissions/analysisPermissions.js';
import { getSettlementsUrl } from '../../utils/permissions/settlementPermissions.js';
import { getEntries } from '../../services/api/entryRequests.js';
import { getAnalyses } from '../../services/api/analysisRequests.js';
import { getSettlements } from '../../services/api/settlementRequests.js';
import './Home.css';

export default function Home() {
    const { userData } = useContext(UserContext);
    const [lastEntry, setLastEntry] = useState(null);
    const [lastAnalysis, setLastAnalysis] = useState(null);
    const [lastSettlement, setLastSettlement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!userData?.token) {
        return <div>No estás autenticado</div>;
    }

    const { user } = userData;  // Accede a los datos del usuario

    useEffect(() => {
        const fetchLastData = async () => {
            try {
                const urlEntries = getEntriesUrl(userData);
                const urlAnalyses = getAnalysesUrl(userData);
                const urlSettlements = getSettlementsUrl(userData);

                const [entriesResponse, analysesResponse, settlementsResponse] = await Promise.all([
                    getEntries(urlEntries),
                    getAnalyses(urlAnalyses),
                    getSettlements(urlSettlements)
                ]);

                const entries = entriesResponse.data;
                const analyses = analysesResponse.data;
                const settlements = settlementsResponse.data;

                console.log('Entries:', entries);
                console.log('Analyses:', analyses);
                console.log('Settlements:', settlements);

                const lastEntry = entries[entries.length - 1];
                const lastAnalysis = analyses.filter(analysis => analysis.analysis_date).sort((a, b) => new Date(b.analysis_date) - new Date(a.analysis_date))[0];
                const lastSettlement = settlements.filter(settlement => settlement.settlement_status === 'Aceptada').sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

                setLastEntry(lastEntry);
                setLastAnalysis(lastAnalysis);
                setLastSettlement(lastSettlement);
            } catch (error) {
                setError('Error al obtener los datos');
            }
            setLoading(false);
        };

        fetchLastData();
    }, [userData]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="home-container">
            <h2>Bienvenido, {user.username}</h2>
            <p>Email: {user.email}</p>

            <div className="cards-container">
                <Link to="../entries" className="card">
                    <h3>Entradas</h3>
                    {lastEntry && (
                        <div>
                            <p><strong>Última entrada:</strong></p>
                            <p>Fecha: {new Date(lastEntry.entry_date).toLocaleDateString()}</p>
                            <p>Kilos: {lastEntry.olive_quantity} kg</p>
                            <p>Estado de análisis: {lastEntry.analysis_status}</p>
                        </div>
                    )}
                </Link>
                <Link to="../analyses" className="card">
                    <h3>Análisis</h3>
                    {lastAnalysis && (
                        <div>
                            <p><strong>Último análisis:</strong></p>
                            <p>Fecha: {new Date(lastAnalysis.analysis_date).toLocaleDateString()}</p>
                            <p>Rendimiento: {lastAnalysis.yield} %</p>
                            <p>Tipo de aceite: {lastAnalysis.oil ? lastAnalysis.oil.name : 'No disponible'}</p>
                        </div>
                    )}
                </Link>
                <Link to="../settlements" className="card">
                    <h3>Liquidaciones</h3>
                    {lastSettlement && (
                        <div>
                            <p><strong>Última liquidación aceptada:</strong></p>
                            <p>ID: {lastSettlement.id}</p>
                            <p>Precio: {lastSettlement.price} €</p>
                            <p>Cantidad: {lastSettlement.amount} kg</p>
                        </div>
                    )}
                </Link>
            </div>
        </div>
    );
}