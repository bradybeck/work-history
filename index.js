const history = require('./pandanHistory.json');
const fs = require('fs')
const fileName = './history.csv';

let daysToDuration = {}; 

var appendToFile = (csvLine) => {
    fs.appendFile(fileName, csvLine, function (err) {
        if (err) return console.log(err);
    });
}

function isWeekend(dayOfWeek) {
    return dayOfWeek === 6 || dayOfWeek  === 0;
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h  : "";
    var mDisplay = m > 0 ? m / 60  : "";

    if (mDisplay) {
        mDisplay = Math.round(mDisplay * 100) / 100
    }

    return hDisplay + mDisplay; 
}

// Group the history entries by day
history.forEach(entry => {
    const date = new Date(Date.parse(entry.start));

    if (!isWeekend(date.getDay())) {
        const key = `${date.getMonth()}.${date.getDate()}.${date.getFullYear()}`;

        let timeLogged = (key in daysToDuration ? daysToDuration[key] : 0) + entry.duration;
        daysToDuration[key] = timeLogged
    }
});

try {
  const data = fs.writeFileSync('./history.csv', "date, day\n")
  for (const [key, value] of Object.entries(daysToDuration)) {
    const finalTime = secondsToHms(value); 
    if (finalTime > 8) {
        appendToFile(`${key}, ${finalTime}\n`);
    } else {
        appendToFile(`${key}, ,${finalTime}\n`);
    }

    

  }

} catch (err) {
  console.error(err)
}