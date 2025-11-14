// components/ClientsPdfGenerator.tsx
import React from "react";
import { Button } from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

interface ClientsPdfGeneratorProps {
  clients: any[];
}

const ClientsPdfGenerator: React.FC<ClientsPdfGeneratorProps> = ({ clients }) => {
  const generatePdf = async () => {
    if (!clients || clients.length === 0) {
      alert("No hay clientes para generar el PDF");
      return;
    }

    const rows = clients
      .map(
        (c) => `
        <tr>
          <td>${c.clientId}</td>
          <td>${c.name}</td>
          <td>${c.nit || "-"}</td>
          <td>${c.address || "-"}</td>
          <td>${c.email || "-"}</td>
          <td>${c.telephone || "-"}</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #2b2b2b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
            th { background-color: #f0f0f0; }
          </style>
        </head>

        <body>
          <h1>Reporte de Clientes</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Dirección</th>
                <th>Email</th>
                <th>Teléfono</th>
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
    await shareAsync(uri, { mimeType: "application/pdf" });
  };

  return (
    <Button title="Generar PDF de Clientes" onPress={generatePdf} />
  );
};

export default ClientsPdfGenerator;
