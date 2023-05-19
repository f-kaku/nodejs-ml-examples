import csvParser, { CsvParser } from 'csv-parser';
import { readFileSync, createReadStream } from 'fs';
import {shuffle, pick} from 'lodash';
import { RandomForestClassifier } from 'random-forest-classifier';

interface IrisData {
    sepal_length: number;
    sepal_width: number;
    petal_length: number;
    petal_width: number;
    species: string;
  }
  
  // CSVファイルを読み込む関数
  function readCSVFile(filePath: string): Promise<IrisData[]> {
    return new Promise((resolve, reject) => {
      const data: IrisData[] = [];
      createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: any) => {
          const irisData: IrisData = {
            sepal_length: Number(row.sepal_length),
            sepal_width: Number(row.sepal_width),
            petal_length: Number(row.petal_length),
            petal_width: Number(row.petal_width),
            species: row.target_names,
          };
          data.push(irisData);
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }


function splitData(data: IrisData[], testRatio: number): [IrisData[], IrisData[]] {
    const shuffledData: IrisData[] = shuffle(data)
    const splitIndex: number = Math.floor(data.length * testRatio);
    const testSet: IrisData[] = shuffledData.slice(0, splitIndex);
    const trainSet: IrisData[] = shuffledData.slice(splitIndex);
    return [trainSet, testSet]
}

async function main() {
  try {
      const data = await readCSVFile('iris_data.csv');
    //   console.log(data);
    splitData(data, 0.3)
    const features = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];
    const target = 'species';
    const trainFeatures = data.map((item) => pick(item, features))
    const trainLabels = data.map((item: IrisData) => item[target]);
    const classifier = new RandomForestClassifier({ nEstimators: 10 });
    classifier.fit(trainFeatures, trainLabels);
    const predictions = classifier.predict(trainFeatures);
    console.log('Predictions:', predictions);
    console.log('Actual Labels:', trainLabels);
    } catch (error) {
      console.error('An error occurred:', error);
    }
}

main()