import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: "#f3f4f6", 
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937", 
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 4,
  },
  row: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#374151",
  },
  value: {
    color: "#1f2937",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
});

/**
 * Componente que genera un documento PDF con los resultados de un análisis
 * de aceituna, incluyendo información del socio, empleado, y los resultados
 * obtenidos en el laboratorio.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.analysis - Objeto que contiene todos los datos del análisis.
 * @param {Object} props.analysis.member - Información del socio.
 * @param {string} props.analysis.member.name - Nombre del socio.
 * @param {string|number} props.analysis.member.member_number - Número de socio.
 * @param {Object} [props.analysis.employee] - Información del empleado que realizó el análisis.
 * @param {string} props.analysis.employee.name - Nombre del empleado.
 * @param {string} props.analysis.analysis_date - Fecha en la que se realizó el análisis.
 * @param {Object} props.analysis.entry - Entrada del análisis.
 * @param {number} props.analysis.entry.olive_quantity - Cantidad de aceituna en kilogramos.
 * @param {number} props.analysis.acidity - Nivel de acidez (%).
 * @param {number} props.analysis.humidity - Nivel de humedad (%).
 * @param {number} props.analysis.yield - Rendimiento del aceite (%).
 * @param {Object} props.analysis.oil - Tipo de aceite resultante.
 * @param {string} props.analysis.oil.name - Nombre del aceite.
 *
 * @returns {JSX.Element} Documento PDF con el informe del análisis.
 *
 * @example
 * <AnalysisPDF analysis={{
 *   member: { name: "Juan Pérez", member_number: 102 },
 *   employee: { name: "Laura Ruiz" },
 *   analysis_date: "2025-03-22",
 *   entry: { olive_quantity: 1500 },
 *   acidity: 0.4,
 *   humidity: 48.5,
 *   yield: 20.3,
 *   oil: { name: "Picual" }
 * }} />
 */
export const AnalysisPDF = ({ analysis }) => {
  const estimatedOil =
    analysis.oil?.name && analysis.entry?.olive_quantity && analysis.yield
      ? ((analysis.entry.olive_quantity * analysis.yield) / 100).toFixed(2)
      : "-";

  return (
    <Document>
      <Page style={styles.page}>
        {/* Logo y título */}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/logo.png" />
        </View>
        <Text style={styles.title}>Informe de Análisis</Text>

        {/* Card: Datos del socio */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos del Socio</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre: </Text>
            <Text style={styles.value}>{analysis.member?.name || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de socio: </Text>
            <Text style={styles.value}>
              {analysis.member?.member_number || "-"}
            </Text>
          </View>
        </View>

        {/* Card: Datos del trabajador */}
        {analysis.employee && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos del empleado</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre: </Text>
              <Text style={styles.value}>{analysis.employee.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha del análisis: </Text>
              <Text style={styles.value}>{analysis.analysis_date || "-"}</Text>
            </View>
          </View>
        )}

        {/* Card: Resultados */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resultados</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad de aceituna: </Text>
            <Text style={styles.value}>
              {analysis.entry?.olive_quantity
                ? `${analysis.entry.olive_quantity} Kg`
                : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Acidez: </Text>
            <Text style={styles.value}>
              {analysis.acidity ? `${analysis.acidity}%` : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Humedad: </Text>
            <Text style={styles.value}>
              {analysis.humidity ? `${analysis.humidity}%` : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rendimiento: </Text>
            <Text style={styles.value}>
              {analysis.yield ? `${analysis.yield}%` : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad estimada de aceite: </Text>
            <Text style={styles.value}>
              {estimatedOil !== "-" ? `${estimatedOil} L` : "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de aceite: </Text>
            <Text style={styles.value}>{analysis.oil?.name || "-"}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generado automáticamente por el sistema de gestión de almazara
          OleoControl © {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
};
