import checkDataCourse from './actions/checkDataCourse';
import dataHandler from './dataHandler';

async function main() {
  console.log(new Date().toISOString(), 'checking');

  // const data = await checkDataCourse();
  const data = { discount: 50, from: 657, to: 328.5 };
  if (data) {
    dataHandler(data);
  }
}

export default main;
