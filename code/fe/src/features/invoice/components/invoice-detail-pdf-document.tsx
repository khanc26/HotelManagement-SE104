import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Booking } from "@/types/booking.type";
import { format } from "date-fns";

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
    width: "30%",
    fontSize: 12,
    fontWeight: "bold",
  },
  summaryValue: {
    width: "70%",
    fontSize: 12,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    padding: 5,
  },
});

interface BookingDetailPDFDocumentProps {
  booking: Booking;
}

export function BookingDetailPDFDocument({
  booking,
}: BookingDetailPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice Details</Text>

        {/* Invoice Information */}
        <Text style={styles.sectionTitle}>Invoice Information</Text>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payer:</Text>
            <Text style={styles.summaryValue}>{booking.user.email}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Price:</Text>
            <Text style={styles.summaryValue}>
              {booking.totalPrice.toLocaleString("en-US")} VND
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Created At:</Text>
            <Text style={styles.summaryValue}>
              {format(new Date(booking.createdAt), "MMM dd, yyyy HH:mm")}
            </Text>
          </View>
        </View>

        {/* Booking Details Table */}
        <Text style={styles.sectionTitle}>Room Details</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Index</Text>
            <Text style={styles.tableCell}>Room</Text>
            <Text style={styles.tableCell}>Day Rent</Text>
            <Text style={styles.tableCell}>Start Date</Text>
            <Text style={styles.tableCell}>End Date</Text>
            <Text style={styles.tableCell}>Unit Price</Text>
            <Text style={styles.tableCell}>Total Price</Text>
            <Text style={styles.tableCell}>Guest Count</Text>
            <Text style={styles.tableCell}>Has Foreigners</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>

          {/* Table Rows */}
          {booking.bookingDetails.map((detail, index) => (
            <View key={detail.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{detail.room.roomNumber}</Text>
              <Text style={styles.tableCell}>{detail.invoice?.dayRent || "N/A"}</Text>
              <Text style={styles.tableCell}>
                {format(new Date(detail.startDate), "MMM dd, yyyy HH:mm")}
              </Text>
              <Text style={styles.tableCell}>
                {format(new Date(detail.endDate), "MMM dd, yyyy HH:mm")}
              </Text>
              <Text style={styles.tableCell}>
                {detail.invoice?.basePrice.toLocaleString("en-US") || "N/A"} VND
              </Text>
              <Text style={styles.tableCell}>
                {detail.invoice?.totalPrice.toLocaleString("en-US") || "N/A"} VND
              </Text>
              <Text style={styles.tableCell}>{detail.guestCount}</Text>
              <Text style={styles.tableCell}>
                {detail.hasForeigners ? "Yes" : "No"}
              </Text>
              <Text style={styles.tableCell}>{detail.invoice?.status || "N/A"}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
