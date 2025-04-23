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
    marginBottom: 32,
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
 * Componente que genera un documento PDF con el informe de recepción de aceituna y su estimación de aceite.
 * Incluye información sobre la fecha de entrada, los datos del socio y los resultados del análisis, 
 * así como la cantidad estimada de aceite resultante.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.entry - Objeto que contiene los datos de la entrada de aceituna.
 * @param {string} props.entry.entry_date - Fecha de entrada de la aceituna.
 * @param {Object} props.entry.member - Información del socio.
 * @param {string} props.entry.member.name - Nombre del socio.
 * @param {string|number} props.entry.member.member_number - Número de socio.
 * @param {number} props.entry.olive_quantity - Cantidad de aceituna en kilogramos.
 * @param {number} props.entry.oil_quantity - Cantidad estimada de aceite resultante en litros.
 *
 * @returns {JSX.Element} Documento PDF con el informe de recepción de aceituna y aceite estimado.
 *
 * @example
 * <EntryWithOilPDF entry={{
 *   entry_date: "2025-03-22",
 *   member: { name: "Juan Pérez", member_number: 102 },
 *   olive_quantity: 1500,
 *   oil_quantity: 200
 * }} />
 */
export const EntryWithOilPDF = ({ entry }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {/* Logo y título */}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/logo.png" />
        </View>
        <Text style={styles.title}>Informe de recepción de aceituna</Text>

        {/* Card: Datos del socio */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fecha de entrada</Text>
          <View style={styles.row}>
            <Text style={styles.value}>{entry.entry_date || "-"}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos del Socio</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre: </Text>
            <Text style={styles.value}>{entry.member?.name || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de socio: </Text>
            <Text style={styles.value}>{entry.member?.member_number || "-"}</Text>
          </View>
        </View>

        {/* Card: Resultados */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resultados</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad de aceituna: </Text>
            <Text style={styles.value}>
              {entry.olive_quantity} Kg
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad de aceite resultante estimado: </Text>
            <Text style={styles.value}>
              {entry.oil_quantity} L
            </Text>
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
