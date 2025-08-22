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


/** Inicio de día de Lima en UTC → ej: "2025-08-20T05:00:00.000Z" */
export const toUtcStartOfDay = (dateOnly: string): string => {
  return DateTime.fromISO(dateOnly, { zone: 'America/Lima' })
    .startOf("day")
    .toUTC()
    .toFormat("yyyy-LL-dd'T'HH:mm:ss.SSS'Z'");
};

/**
 * Devuelve el fin de día de Lima en UTC: "YYYY-MM-DDT04:59:59.999Z"
 * (ej: 2025-08-23 en Lima => 2025-08-24T04:59:59.999Z en UTC)
 */
export const toUtcEndOfDay = (dateOnly: string): string => {
  return DateTime.fromISO(dateOnly, { zone: "America/Lima" })
    .endOf("day")
    .toUTC()
    .toFormat("yyyy-LL-dd'T'HH:mm:ss.SSS'Z'");
};


