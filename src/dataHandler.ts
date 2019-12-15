import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import pick from 'lodash.pick';
import isEqual from 'lodash.isequal';
import notifier from 'node-notifier';

interface IData {
  discount: number;
  from: number;
  to: number;
}

interface IEntity {
  id: string;
  discount: number;
  from: number;
  to: number;
  createdAt: string;
}

interface IModel {
  data: IEntity[];
}

function addData(data: IData) {
  try {
    const dirData = path.resolve('./data/data.json');

    let oldData: IModel = { data: [] };

    if (!fs.existsSync(dirData)) {
      fs.mkdirSync(path.resolve('./data'));
      fs.writeFileSync(dirData, JSON.stringify(oldData));
    } else {
      oldData = JSON.parse(fs.readFileSync(dirData, 'utf-8'));

      if (oldData.data.length) {
        const lastItem = oldData.data[oldData.data.length - 1];
        const importantFields = ['discount', 'from', 'to'];

        if (isEqual(data, pick(lastItem, importantFields))) {
          console.log(new Date().toISOString(), 'No changes from last check');
          return;
        }
      }
    }

    oldData.data.push({
      id: uuid().substring(0, 8),
      ...data,
      createdAt: new Date().toISOString()
    });

    const newData = JSON.stringify(oldData);
    fs.writeFileSync(dirData, newData);

    const title = 'The data of course has change!';
    const message = `discount: ${data.discount} | from: ${data.from} | to: ${data.to}`;

    console.log(new Date().toISOString(), title, message);
    notifier.notify({ title, message });
  } catch (error) {
    console.error(error);
  }
}

// addData({
//   discount: 79,
//   to: 123,
//   from: 90
// });

export default addData;
