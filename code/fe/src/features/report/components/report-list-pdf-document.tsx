import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MonthlyRevenue } from '@/types/report.type';

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
  chartTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
});

interface ReportListPDFDocumentProps {
  reports: MonthlyRevenue[];
}

export function ReportListPDFDocument({ reports }: ReportListPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Monthly Revenue Report</Text>
        
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Month</Text>
          <Text style={styles.tableCell}>Total Revenue</Text>
        </View>
        
        {/* Table Rows */}
        {reports.map((report) => (
          <View key={report.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{report.month}</Text>
            <Text style={styles.tableCell}>{report.totalRevenue.toLocaleString('en-US')} VND</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
} 