require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const axios = require('axios').default;

const sessionToken = process.env.sessionToken;

function getInput(q) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(q, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function buildFile() {
  const today = new Date();
  const yearToday = today.getFullYear();
  let year = 0;
  while (year == 0) {
    const response = await getInput(`please enter a year between 2015-${yearToday}: (${yearToday}) `);
    const y = parseInt(response);
    if (response == '') {
      year = yearToday;
    } else if (isNaN(y)) {
      console.log(`${response} is not a valid year!`);
    } else if (y < 2015) {
      console.log(`There are no advent of code challenges before 2015`);
    } else if (y > yearToday) {
      console.log(`You are not from the future`);
    } else {
      year = y;
    }
  }
  const dayToday = today.getDate();
  let day = '';
  while (day == '') {
    const response = await getInput(`please enter a day between 1-25: (${dayToday}) `);
    const d = parseInt(response);
    if (response == '') {
      day = `${dayToday}`;
    } else if (isNaN(d)) {
      console.log(`${response} is not a valid day!`);
    } else if (d < 1 || d > 25) {
      console.log(`Advent of code challenges are only on days 1-25`);
    } else {
      day = `${d}`;
    }
  }
  if (day.length == 1) {
    day = `0${day}`;
  }

  const yearDir = `./${year}`;
  const dayDir = `${yearDir}/day${day}`;
  const inputDir = `${dayDir}/input`;
  const dirs = [yearDir, dayDir, inputDir];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log(`${dir} created successfully!`);
    }
  }

  const templateFile = `./template/dayTemplate/puzzle.ts`;
  const dayFile = `${dayDir}/puzzle.ts`;

  if (fs.existsSync(dayFile)) {
    console.log(`${dayFile} already exists!`);
  } else {
    let data = [];
    const lines = fs.readFileSync(templateFile, { encoding: 'utf-8' }).split('\n');
    for (const line of lines) {
      if (line.includes('export')) {
        data.push(line.replace('Year', year).replace('Day', day));
      } else {
        data.push(line);
      }
    }

    fs.writeFileSync(dayFile, data.join('\r\n'), { encoding: 'utf-8' });
    console.log(`${dayFile} created successfully!`);
  }

  const inputFile = `${inputDir}/input.txt`;
  if (fs.existsSync(inputFile)) {
    console.log(`${inputFile} already exists!`);
  } else {
    let data = '';
    if (sessionToken) {
      const response = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: { Cookie: `session=${sessionToken}` },
      });
      if (response.status === 200) {
        data = response.data.split('\n');
        while (data[data.length - 1] == '') {
          data.pop();
        }
        data = data.join('\r\n');
      } else {
        console.error(response);
      }
    }
    fs.writeFileSync(inputFile, data, { encoding: 'utf-8' });
    console.log(`${inputFile} created successfully!`);
  }

  const testInputFile = `${inputDir}/testInput.txt`;
  if (fs.existsSync(testInputFile)) {
    console.log(`${testInputFile} already exists!`);
  } else {
    fs.writeFileSync(testInputFile, '', { encoding: 'utf-8' });
    console.log(`${testInputFile} created successfully!`);
  }
}

buildFile();
