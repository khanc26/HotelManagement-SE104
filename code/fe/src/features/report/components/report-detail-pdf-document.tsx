import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MonthlyRevenueByRoomType } from '@/types/report.type';

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

interface ReportDetailPDFDocumentProps {
  reports: MonthlyRevenueByRoomType[];
  month: string;
}

export function ReportDetailPDFDocument({ reports, month }: ReportDetailPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Revenue Report for {month} by Room Type</Text>
        
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Room Type</Text>
          <Text style={styles.tableCell}>Revenue</Text>
          <Text style={styles.tableCell}>Percentage</Text>
        </View>
        
        {/* Table Rows */}
        {reports.map((report, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{report.roomType}</Text>
            <Text style={styles.tableCell}>{report.revenue.toLocaleString('en-US')} VND</Text>
            <Text style={styles.tableCell}>{report.percent}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
} 