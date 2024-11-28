declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableOptions {
      head: string[][];
      body: string[][];
      startY?: number;
      theme?: 'striped' | 'grid' | 'plain';
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;

  export default autoTable;
}