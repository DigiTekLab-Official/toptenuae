// src/components/ui/SanityTable.tsx
import React from "react";

interface TableRow {
  _key: string;
  cells: string[];
}

interface TableValue {
  rows: TableRow[];
}

interface SanityTableProps {
  value: TableValue;
}

export default function SanityTable({ value }: SanityTableProps) {
  const { rows } = value;

  if (!rows || rows.length === 0) return null;

  const [headerRow, ...dataRows] = rows;
  const columnCount = headerRow?.cells?.length || 0;
  const isTwoColumnTable = columnCount === 2;

  // ========================
  // LAYOUT 1: TWO-COLUMN TABLE
  // Renders as a standard table on ALL screens (Best for "Key : Value" lists)
  // ========================
  if (isTwoColumnTable) {
    return (
      <div className="overflow-x-auto my-8 border border-gray-200 shadow-sm rounded-lg w-full">
        <table className="w-full text-base text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {headerRow.cells.map((cell, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-5 py-4 font-bold text-gray-700 border-b border-gray-200"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {dataRows.map((row, rowIndex) => (
              <tr key={row._key} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                {row.cells.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className={`px-5 py-4 text-gray-800 leading-relaxed ${cellIndex === 0 ? "font-semibold text-gray-900 w-1/3" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ========================
  // LAYOUT 2: COMPLEX TABLE (3+ COLUMNS)
  // Desktop: Table View | Mobile: Card View
  // ========================
  return (
    <div className="my-8">
      {/* DESKTOP VIEW (Hidden on Mobile) */}
      <div className="hidden md:block overflow-hidden border border-gray-400 shadow-sm">
        <table className="w-full text-base text-left border-collapse">
          <thead className="bg-[#312e81] text-white">
            <tr>
              {headerRow.cells.map((cell, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-3 py-2 font-bold border-r border-indigo-700 last:border-r-0 whitespace-nowrap"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dataRows.map((row, rowIndex) => (
              <tr key={row._key} className="hover:bg-gray-50 transition-colors">
                {row.cells.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className={`px-3 py-4 border-r border-gray-400 last:border-r-0 text-gray-800 ${cellIndex === 0 ? "font-bold text-gray-900" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW (Visible only on Mobile) */}
      <div className="md:hidden space-y-6">
        {dataRows.map((row) => (
          <div 
            key={row._key} 
            // UPDATED CLASS: Added border-l-4 border-l-[#312e81] (Indigo)
            className="bg-white border border-gray-200 border-l-4 border-l-[#8B5CF6] rounded-xl shadow-sm overflow-hidden"
          >
            {row.cells.map((cell, cellIndex) => (
              <div 
                key={cellIndex}
                className={`px-5 py-5 flex flex-col ${
                  cellIndex !== row.cells.length - 1 ? "border-b border-gray-100" : ""
                } ${cellIndex === 0 ? "bg-gray-50" : ""}`}
              >
                {/* The Header Label */}
                <span className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">
                  {headerRow.cells[cellIndex]}
                </span>
                {/* The Value */}
                <span className={`text-base leading-relaxed ${cellIndex === 0 ? "font-black text-gray-900 text-lg" : "text-gray-800"}`}>
                  {cell}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}