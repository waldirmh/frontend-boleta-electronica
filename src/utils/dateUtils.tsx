import { DateTime } from 'luxon';

/**
 * Formatea una fecha ISO a formato peruano (DD/MM/YYYY y HH:mm en hora local).
 * @param date - Fecha en formato ISO (ej: "2025-04-23T18:00:52.497Z")
 */
export const formatDateTime = (date: string) => {
  const datetime = DateTime.fromISO(date, { zone: 'America/Lima' });
  const formattedDate = datetime.toFormat('dd/MM/yyyy'); // Ej: 23/04/2025
  const formattedTime = datetime.toFormat('h:mm a');       // Ej: 13:45

  return {
    date: formattedDate,
    time: formattedTime
  };
};


/**
 * Combina una fecha (YYYY-MM-DD) con la hora actual en Lima, y devuelve un ISO UTC string.
 * @param dateOnly Fecha seleccionada por el usuario (formato 'YYYY-MM-DD')
 */
export const combineDateWithCurrentTime = (dateOnly: string): string => {
  const now = DateTime.now().setZone('America/Lima');

  const combined = DateTime.fromISO(dateOnly, { zone: 'America/Lima' }).set({
    hour: now.hour,
    minute: now.minute,
    second: now.second,
    millisecond: now.millisecond,
  });

  return combined.toUTC().toISO(); // para enviar en la request
};


/**
 * Devuelve "YYYY-MM-DDT00:00:00.000Z" en UTC literal para la fecha dada (YYYY-MM-DD)
 * @param dateOnly 
 * @returns 
 */
export const toUtcStartOfDay = (dateOnly: string): string => {
  return DateTime.fromISO(dateOnly, { zone: 'utc' })
    .startOf('day')
    .toFormat("yyyy-LL-dd'T'HH:mm:ss.SSS'Z'");
};

/**
 * Devuelve "YYYY-MM-DDT23:59:59.999Z" en UTC literal para la fecha dada (YYYY-MM-DD).
 * @param dateOnly 
 * @returns 
 */
export const toUtcEndOfDay = (dateOnly: string): string => {
  return DateTime.fromISO(dateOnly, { zone: 'utc' })
    .endOf('day')
    .toFormat("yyyy-LL-dd'T'HH:mm:ss.SSS'Z'");
};


