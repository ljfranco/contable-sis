// src/lib/bcu/bcuCotizaciones.ts

export async function fetchBCUCotizaciones(moneda:number, fechaDesde:string, fechaHasta:string) {
  const url = 'https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones';

  const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cot="Cotiza">
      <soapenv:Header/>
      <soapenv:Body>
        <cot:wsbcucotizaciones.Execute>
          <cot:Entrada>
            <cot:Moneda>
              <cot:item>${moneda}</cot:item>
            </cot:Moneda>
            <cot:FechaDesde>${fechaDesde}</cot:FechaDesde>
            <cot:FechaHasta>${fechaHasta}</cot:FechaHasta>
            <cot:Grupo>0</cot:Grupo>
          </cot:Entrada>
        </cot:wsbcucotizaciones.Execute>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'Accept': 'text/xml'
    },
    body: xmlBody.trim()
  });

  if (!response.ok) {
    throw new Error(`Error SOAP: ${response.statusText}`);
  }

  return await response.text(); // Devuelve el XML como string
}
