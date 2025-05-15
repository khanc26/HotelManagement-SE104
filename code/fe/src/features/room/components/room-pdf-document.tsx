import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Room } from '@/types/room.type';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
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

interface RoomPDFDocumentProps {
  rooms: Room[];
}

export function RoomPDFDocument({ rooms }: RoomPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Room List</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Room Number</Text>
            <Text style={styles.tableCell}>Room Type</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>
          
          {/* Table Rows */}
          {rooms.map((room) => (
            <View key={room.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{room.roomNumber}</Text>
              <Text style={styles.tableCell}>{room.roomType.name}</Text>
              <Text style={styles.tableCell}>{room.roomType.roomPrice.toLocaleString('en-US')} VND</Text>
              <Text style={styles.tableCell}>{room.status === 'available' ? 'Available' : 'Occupied'}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
} 