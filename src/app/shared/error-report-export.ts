import * as XLSX from 'xlsx';

/**
 * Builds and downloads an .xlsx file entirely in the browser from rows the
 * backend already returned in the upload response (error_orders /
 * skipped_details) — no server-side file storage or download endpoint
 * involved. That sidesteps the class of bug where a server-generated report
 * used a fixed shared filename (collision + cross-user risk) and was linked
 * with a URL that resolved against the wrong origin.
 *
 * xlsx.write* only — never call XLSX.read/readFile on user-supplied files
 * with this library (the public npm build has known parsing-related CVEs;
 * write-only usage on our own trusted JSON data doesn't hit that code path).
 */
export function downloadErrorReportExcel(rows: Record<string, any>[], filenamePrefix: string): void {
  if (!rows || rows.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  XLSX.writeFile(workbook, `${filenamePrefix}_${timestamp}.xlsx`);
}
