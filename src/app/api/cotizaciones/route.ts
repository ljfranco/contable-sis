// src/app/api/cotizaciones/route.ts
import { NextResponse } from 'next/server';
import { fetchBCUCotizaciones } from '../../lib/bcu/bcuCotizaciones';
import { parseStringPromise } from 'xml2js';
import { stripPrefix } from "xml2js/lib/processors";

function getDateRangeForLastMonth() {
    const now = new Date();
    const fechaHasta = now.toISOString().slice(0, 10);
    const fechaDesde = new Date(now.setMonth(now.getMonth() - 1)).toISOString().slice(0, 10);
    return { fechaDesde, fechaHasta };
}

export async function GET() {
    const { fechaDesde, fechaHasta } = getDateRangeForLastMonth();

    try {
        const xmlResponse = await fetchBCUCotizaciones(
            2225,
            fechaDesde,
            fechaHasta
        );

       // console.log('XML Response:', xmlResponse); // Para depuración

        const parsed = await parseStringPromise(xmlResponse, {
            tagNameProcessors: [stripPrefix], // elimina "SOAP-ENV:", etc.
            explicitArray: false,             // evita tener `[0]` por todos lados
        });

       // console.dir(parsed.Envelope.Body, { depth: null });

        const datos = parsed.Envelope.Body['wsbcucotizaciones.ExecuteResponse'].Salida.datoscotizaciones['datoscotizaciones.dato'];

        const result = Array.isArray(datos) ? datos : [datos]; // por si es solo 1

        const cotizaciones = result.map((item) => ({
            fecha: item.Fecha,
            moneda: item.Moneda,
            nombre: item.Nombre,
            compra: item.TCC,
            venta: item.TCV,
        }));

       // console.log('Cotizaciones:', cotizaciones); // Para depuración
        return NextResponse.json(cotizaciones);
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
        return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 });
    }
}
