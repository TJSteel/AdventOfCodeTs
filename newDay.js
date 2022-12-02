const fs = require('fs');
const readline = require('readline');

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
  let year = 0;
  while (year == 0) {
    const response = await getInput(`please enter a year: `);
    const y = parseInt(response);
    if (isNaN(y)) {
      console.log(`${response} is not a valid year!`);
    } else {
      year = y;
    }
  }
  let day = 0;
  while (day == 0) {
    const response = await getInput(`please enter a day: `);
    const d = parseInt(response);
    if (isNaN(d)) {
      console.log(`${response} is not a valid day!`);
    } else {
      day = response.length == 1 ? `0${d}` : d;
    }
  }

  const dirs = [`./${year}`, `./${year}/input`, `./${year}/testInput`];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log(`${dir} created successfully!`);
    }
  }

  const templateFile = `./template/dayTemplate.ts`;
  const dayFile = `./${year}/day${day}.ts`;

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

  const inputFiles = [`./${year}/input/day${day}.txt`, `./${year}/testInput/day${day}.txt`];
  for (const inputFile of inputFiles) {
    if (fs.existsSync(inputFile)) {
      console.log(`${inputFile} already exists!`);
    } else {
      fs.writeFileSync(inputFile, '', { encoding: 'utf-8' });
      console.log(`${inputFile} created successfully!`);
    }
  }
}

buildFile();
