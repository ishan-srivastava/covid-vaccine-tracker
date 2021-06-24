import { Center, Session } from './main';
import { recepientEmails } from './data';
import myDate from 'date-and-time';

export function parseInfo(centers: any) {
  let finalData =
    'We are looking for all the available slots in NEXT 4 WEEKS from now.\n\n';
  let count = 1;
  for (const key of Object.keys(centers)) {
    const center: Center = centers[key];
    finalData = finalData + `\n\n${count++}. In ${center.name}, we've got : \n`;
    for (const key2 of Object.keys(center.sessions)) {
      const session: Session = center.sessions[key2];
      finalData =
        finalData +
        `👉 ${session.available_capacity} ${session.vaccine || ''} dose${
          session.available_capacity > 1 ? 's' : ''
        } available on ${session.date}. \n`;
    }
  }
  if (!Object.keys(centers)?.length) {
    finalData =
      finalData +
      `All available slots are COMPLETELY BOOKED for Bareilly 💉\n\n\n\n`;
  }
  finalData = `${finalData} \n Go to https://www.cowin.gov.in/home for the slot registration.\n\n This service runs every 2 hours from 05:00 to 21:00.\nReply to this e-mail for suggestions/queries/unsubscribing.\n\n\n💪 Stay Safe! We've got this.\nMade with ❤️ in Bareilly by Ishan Srivastava.`;
  return `${finalData}`;
}

export function sendMail(
  data,
  subject = `Vaccine slots available on ${myDate.format(
    new Date(),
    'DD-MM-YYYY HH:MM',
  )}`,
) {
  for (const rec of recepientEmails) {
    const send = require('gmail-send')({
      user: '***',
      pass: '***',
      to: rec,
      subject,
    });
    send(
      {
        text: data,
      },
      (error, result) => {
        if (error) {
          console.log('MAIL ERROR', error);
        }
        console.log(
          'MAIL SUCCESS',
          `Vaccine slots available on ${myDate.format(
            new Date(),
            'DD-MM-YYYY HH:MM',
          )}`,
          result,
        );
      },
    );
  }
}
