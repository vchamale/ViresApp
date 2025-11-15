// // components/ShipmentsPdfGenerator.tsx
// import React from "react";
// import { Button } from "react-native";
// import * as Print from "expo-print";
// import { shareAsync } from "expo-sharing";

// interface ShipmentsPdfGeneratorProps {
//   shipments: any[];
// }

// const ShipmentsPdfGenerator: React.FC<ShipmentsPdfGeneratorProps> = ({ shipments }) => {
//   const generatePdf = async () => {
//     if (!shipments || shipments.length === 0) {
//       alert("No hay viajes para generar el PDF");
//       return;
//     }

//     const rows = shipments
//       .map(
//         (s) => `
//         <tr>
//           <td>${s.shipmentId}</td>
//           <td>${s.container?.containerNumber || "-"}</td>
//           <td>${s.client?.name || "-"}</td>
//           <td>${s.driver?.names || ""} ${s.driver?.last_names || ""}</td>
//           <td>${s.status?.description || "-"}</td>
//         </tr>
//       `
//       )
//       .join("");

//     const html = `
//       <html>
//         <head>
//           <meta charset="utf-8" />
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             h1 { text-align: center; color: #2b2b2b; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td {
//               border: 1px solid #ccc;
//               padding: 8px;
//               font-size: 12px;
//             }
//             th { background-color: #f0f0f0; }
//           </style>
//         </head>

//         <body>
//           <h1>Reporte de Viajes</h1>
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Contenedor</th>
//                 <th>Cliente</th>
//                 <th>Piloto</th>
//                 <th>Estado</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;

//     const { uri } = await Print.printToFileAsync({ html });
//     await shareAsync(uri, { mimeType: "application/pdf" });
//   };

//   return <Button title="Generar PDF de Viajes" onPress={generatePdf} />;
// };

// export default ShipmentsPdfGenerator;




// components/ShipmentsPdfGenerator.tsx
import React, { ReactNode } from 'react';
import { Button } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

interface ShipmentsPdfGeneratorProps {
  shipments: any[];
  renderTrigger?: (onGenerate: () => void) => ReactNode;
}

const ShipmentsPdfGenerator: React.FC<ShipmentsPdfGeneratorProps> = ({
  shipments,
  renderTrigger,
}) => {
  const generatePdf = async () => {
    if (!shipments || shipments.length === 0) {
      alert('No hay viajes para generar el PDF');
      return;
    }

    const rows = shipments
      .map(
        (s) => `
        <tr>
          <td>${s.shipmentId}</td>
          <td>${s.container?.containerNumber || '-'}</td>
          <td>${s.client?.name || '-'}</td>
          <td>${s.driver?.names || ''} ${s.driver?.last_names || ''}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #2b2b2b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              font-size: 12px;
            }
            th { background-color: #f0f0f0; }
          </style>
        </head>

        <body>
          <h1>Reporte de Viajes</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Contenedor</th>
                <th>Cliente</th>
                <th>Piloto</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { mimeType: 'application/pdf' });
  };

  if (renderTrigger) {
    // Usar trigger custom (por ejemplo el botón con Lucide en Reports)
    return <>{renderTrigger(generatePdf)}</>;
  }

  // Fallback por si lo usas en otro lado sin custom trigger
  return <Button title="Generar PDF de Viajes" onPress={generatePdf} />;
};

export default ShipmentsPdfGenerator;