import axios from 'axios';
import myDate from 'date-and-time';
import { parseInfo, sendMail } from './helper';
const now = new Date();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require('node-cron');

cron.schedule('1 5-21/2 * * *', () => {
  fetchVaccines().then((val) => {
    const finalCenters: any = {};
    const centers: Center[] = val;
    for (const center of centers) {
      for (const session of center.sessions) {
        if (session.min_age_limit < 44 && session.available_capacity) {
          if (finalCenters?.[center.name]) {
            finalCenters[center.name] = {
              ...finalCenters[center.name],
              sessions: {
                ...finalCenters[center.name].sessions,
                [session.session_id]: { ...session },
              },
            };
          } else {
            finalCenters[center.name] = {
              ...center,
              sessions: { [session.session_id]: { ...session } },
            };
          }
        }
      }
    }
    sendMail(parseInfo(finalCenters));
  });
// });

async function fetchVaccines() {
  try {
    const data1 = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=637&date=${myDate.format(
        now,
        'DD-MM-YYYY',
      )}`,
    );
    const data2 = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=637&date=${myDate.format(
        myDate.addDays(now, 7),
        'DD-MM-YYYY',
      )}`,
    );
    const data3 = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=637&date=${myDate.format(
        myDate.addDays(now, 14),
        'DD-MM-YYYY',
      )}`,
    );
    const data4 = await axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=637&date=${myDate.format(
        myDate.addDays(now, 21),
        'DD-MM-YYYY',
      )}`,
    );
    return data1.data.centers.concat(
      data2.data.centers.concat(data3.data.centers.concat(data4.data.centers)),
    );
  } catch (e) {
    console.log('API FAILED');
    return [];
  }
}

export interface Center {
  name: string;
  block_name: string;
  fee_type: 'Free' | 'Paid';
  from: string;
  to: string;
  sessions: Session[];
  center_id: string;
}

export interface Session {
  min_age_limit: number;
  available_capacity: number;
  date: string;
  session_id: string;
  vaccine: string;
}
