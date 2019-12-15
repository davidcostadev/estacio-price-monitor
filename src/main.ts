import { CronJob } from 'cron';
import checkDataCourse from './actions/checkDataCourse';
import dataHandler from './dataHandler';

function main() {
  console.log(new Date().toISOString(), 'started');

  // “At 09:45 on every day-of-week from Monday through Friday.”
  const cron = new CronJob('45 9 * * 1-5', async () => {
    console.log(new Date().toISOString(), 'checking');
    const data = await checkDataCourse();

    if (data) {
      dataHandler(data);
    }
  });

  cron.start();
}

export default main;
