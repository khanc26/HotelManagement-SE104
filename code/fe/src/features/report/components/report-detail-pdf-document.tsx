import { MonthlyRevenueByRoomType } from "@/types/report.type";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
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

interface ReportDetailPDFDocumentProps {
  reports: MonthlyRevenueByRoomType[];
  month: string;
}

export function ReportDetailPDFDocument({
  reports,
  month,
}: ReportDetailPDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Revenue by Room Type - {month}</Text>

        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Room Type</Text>
          <Text style={styles.tableCell}>Revenue</Text>
          <Text style={styles.tableCell}>Percentage</Text>
        </View>

        {/* Table Rows */}
        {reports.map((report, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{report.roomTypeName}</Text>
            <Text style={styles.tableCell}>
              {report.revenue.toLocaleString("en-US")} VND
            </Text>
            <Text style={styles.tableCell}>{report.percentage}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
