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
  statusAceptada: {
    fontSize: 18,
    color: "green"
  },
  statuCancelada: {
    fontSize: 18,
    color: "red"
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
});

/**
 * Componente que genera un documento PDF con el informe de liquidación de un aceite. 
 * Incluye información sobre los datos del socio, el empleado que resolvió la liquidación,
 * los detalles del aceite, y el estado de la liquidación.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.settlement - Objeto que contiene los datos de la liquidación.
 * @param {string} props.settlement.settlement_date - Fecha de la solicitud de liquidación.
 * @param {Object} props.settlement.member - Información del socio.
 * @param {string} props.settlement.member.name - Nombre del socio.
 * @param {string|number} props.settlement.member.member_number - Número de socio.
 * @param {Object} props.settlement.employee - Información del empleado que resolvió la liquidación.
 * @param {string} props.settlement.employee.name - Nombre del empleado.
 * @param {string} props.settlement.settlement_date_res - Fecha de resolución de la liquidación.
 * @param {number} props.settlement.amount - Cantidad de aceite en litros.
 * @param {Object} props.settlement.oil - Información sobre el aceite.
 * @param {string} props.settlement.oil.name - Nombre del tipo de aceite.
 * @param {number} props.settlement.price - Precio por litro de aceite.
 * @param {string} props.settlement.settlement_status - Estado de la liquidación (ACEPTADA, CANCELADA, otro).
 *
 * @returns {JSX.Element} Documento PDF con el informe de liquidación.
 *
 * @example
 * <SettlementPDF settlement={{
 *   settlement_date: "2025-03-22",
 *   member: { name: "Juan Pérez", member_number: 102 },
 *   employee: { name: "Pedro García" },
 *   settlement_date_res: "2025-03-23",
 *   amount: 1000,
 *   oil: { name: "Aceite de oliva virgen extra" },
 *   price: 3.5,
 *   settlement_status: "ACEPTADA"
 * }} />
 */
export const SettlementPDF = ({ settlement }) => {
  const amount = Number(settlement.amount);
  const price = Number(settlement.price);

  const status = settlement.settlement_status.toUpperCase();

  let statusStyle = styles.statusOtro;

  if (status === "ACEPTADA") {
    statusStyle = styles.statusAceptada;
  } else if (status === "CANCELADA") {
    statusStyle = styles.statusCancelada;
  }

  return (
    <Document>
      <Page style={styles.page}>
        {/* Logo y título */}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/logo.png" />
        </View>
        <Text style={styles.title}>Informe de Liquidación</Text>

        {/* Card: Datos del socio */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos del Socio</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de solicitud: </Text>
              <Text style={styles.value}>
                {settlement.settlement_date || "-"}
              </Text>
            </View>
            <Text style={styles.label}>Nombre: </Text>
            <Text style={styles.value}>{settlement.member?.name || "-"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de socio: </Text>
            <Text style={styles.value}>
              {settlement.member?.member_number || "-"}
            </Text>
          </View>
        </View>

        {/* Card: Datos del trabajador */}
        {settlement.employee && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos del empleado</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre: </Text>
              <Text style={styles.value}>{settlement.employee?.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de resolución: </Text>
              <Text style={styles.value}>
                {settlement.settlement_date_res || "-"}
              </Text>
            </View>
          </View>
        )}

        {/* Card: Resultados */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resultado</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad de aceite: </Text>
            <Text style={styles.value}>{amount} L</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de aceite: </Text>
            <Text style={styles.value}>{settlement.oil?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Precio por L: </Text>
            <Text style={styles.value}>{price} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total liquidación: </Text>
            <Text style={styles.value}>{amount * price} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado: </Text>
            <Text style={statusStyle}>{status}</Text>
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
