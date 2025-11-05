// src/utils/exportUtils.js
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * 📊 Export data to Excel
 */
export const exportToExcel = (data, fileName = "data.xlsx") => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, fileName);
};

/**
 * 📄 Export data to PDF
 */
export const exportToPDF = (
  data,
  columns = Object.keys(data[0] || {}),
  fileName = "data.pdf"
) => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }

  const doc = new jsPDF();
  doc.text("Scholarship Users Report", 14, 15);
  const tableData = data.map((item) => columns.map((col) => item[col] || "-"));

  doc.autoTable({
    startY: 25,
    head: [columns],
    body: tableData,
  });

  doc.save(fileName);
};
