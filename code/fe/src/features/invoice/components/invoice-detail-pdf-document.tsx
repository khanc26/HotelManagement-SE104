import { Invoice } from "@/types/invoice.type";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  summaryLabel: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },
  summaryValue: {
    width: "60%",
    fontSize: 12,
  },
});

interface InvoiceDetailPDFDocumentProps {
  invoice: Invoice;
}

export function InvoiceDetailPDFDocument({ invoice }: InvoiceDetailPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice Details</Text>
        <Text style={styles.sectionTitle}>Invoice Information</Text>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Invoice ID:</Text>
            <Text style={styles.summaryValue}>{invoice.id}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payer:</Text>
            <Text style={styles.summaryValue}>{invoice.booking.user.email}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Room Number:</Text>
            <Text style={styles.summaryValue}>{invoice.booking.room.roomNumber}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Price:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(invoice.basePrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Price:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(invoice.totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Days Rented:</Text>
            <Text style={styles.summaryValue}>{invoice.dayRent}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status:</Text>
            <Text style={styles.summaryValue}>{invoice.status}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Created At:</Text>
            <Text style={styles.summaryValue}>{format(new Date(invoice.createdAt), "yyyy-MM-dd HH:mm")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Updated At:</Text>
            <Text style={styles.summaryValue}>{format(new Date(invoice.updatedAt), "yyyy-MM-dd HH:mm")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
