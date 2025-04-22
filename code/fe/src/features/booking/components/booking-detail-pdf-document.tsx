import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Booking } from '@/types/booking.type';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
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
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    width: '30%',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryValue: {
    width: '70%',
    fontSize: 12,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
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

export function BookingDetailPDFDocument({ booking }: BookingDetailPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Booking Details</Text>
        
        {/* Booking Information */}
        <Text style={styles.sectionTitle}>Booking Information</Text>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Booking ID:</Text>
            <Text style={styles.summaryValue}>{booking.id}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>User Email:</Text>
            <Text style={styles.summaryValue}>{booking.user.email}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Price:</Text>
            <Text style={styles.summaryValue}>{booking.totalPrice.toLocaleString('en-US')} VND</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Created At:</Text>
            <Text style={styles.summaryValue}>
              {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
            </Text>
          </View>
        </View>

        {/* Booking Details Table */}
        <Text style={styles.sectionTitle}>Room Details</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Room Number</Text>
            <Text style={styles.tableCell}>Guest Count</Text>
            <Text style={styles.tableCell}>Has Foreigners</Text>
            <Text style={styles.tableCell}>Start Date</Text>
            <Text style={styles.tableCell}>End Date</Text>
            <Text style={styles.tableCell}>Status</Text>
            <Text style={styles.tableCell}>Total Price</Text>
          </View>
          
          {/* Table Rows */}
          {booking.bookingDetails.map((detail) => (
            <View key={detail.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{detail.room.roomNumber}</Text>
              <Text style={styles.tableCell}>{detail.guestCount}</Text>
              <Text style={styles.tableCell}>{detail.hasForeigners ? 'Yes' : 'No'}</Text>
              <Text style={styles.tableCell}>{format(new Date(detail.startDate), 'MMM dd, yyyy')}</Text>
              <Text style={styles.tableCell}>{format(new Date(detail.endDate), 'MMM dd, yyyy')}</Text>
              <Text style={styles.tableCell}>{detail.status}</Text>
              <Text style={styles.tableCell}>{detail.totalPrice.toLocaleString('en-US')} VND</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
} 