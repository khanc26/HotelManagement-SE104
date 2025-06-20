import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  Booking,
  ParticipantResponse,
} from "@/types/booking.type";
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
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },
  summaryValue: {
    width: "60%",
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
        <Text style={styles.title}>Booking Details</Text>
        <Text style={styles.sectionTitle}>Booking Information</Text>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Room Number:</Text>
            <Text style={styles.summaryValue}>{booking.room.roomNumber}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Check In Date:</Text>
            <Text style={styles.summaryValue}>
              {format(new Date(booking.checkInDate), "yyyy-MM-dd")}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Check Out Date:</Text>
            <Text style={styles.summaryValue}>
              {format(new Date(booking.checkOutDate), "yyyy-MM-dd")}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Booker Email:</Text>
            <Text style={styles.summaryValue}>{booking.user.email}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Created At:</Text>
            <Text style={styles.summaryValue}>
              {format(new Date(booking.createdAt), "yyyy-MM-dd")}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Updated At:</Text>
            <Text style={styles.summaryValue}>
              {format(new Date(booking.updatedAt), "yyyy-MM-dd")}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Participants</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Email</Text>
            <Text style={styles.tableCell}>Full Name</Text>
            <Text style={styles.tableCell}>Address</Text>
            <Text style={styles.tableCell}>Identity Number</Text>
          </View>
          {/* Table Rows */}
          {booking.participants.map((p: ParticipantResponse, idx: number) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{p.email}</Text>
              <Text style={styles.tableCell}>{p.profile.fullName}</Text>
              <Text style={styles.tableCell}>{p.profile.address}</Text>
              <Text style={styles.tableCell}>{p.profile.identityNumber}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
