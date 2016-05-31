'use strict';

const fs = require("fs");
const moment = require("moment");

class RuleLoader {

    constructor(){}

    loadFile(filePath){

        let parsedRules = [];

        let lines = fs.readFileSync(filePath).toString().trim().split("\n");

        lines.forEach((line) => {

            let items = line.split("\t");

            parsedRules.push({
                from: moment.utc(items[0], "DD/MM/YYYY").startOf("day").toDate().getTime(),
                to: moment.utc(items[1], "DD/MM/YYYY").endOf("day").toDate().getTime(),
                gender: items[2],
                ageOfRetirement: (items[3].indexOf("birthday") > -1) ? this.parseAgeOfRetirement(items[3]) : null,
                dateOfRetirement: this.parseDateOfRetirement(items[3])
            });
        });

        return parsedRules;
    }

    parseDateOfRetirement(item){
        return (item.indexOf("birthday") === -1) ? moment.utc(item, "DD[-]MMM[-]YY").startOf("day").toDate().getTime() : null
    }

    parseAgeOfRetirement(retirementAgeText){
        let retirementAge = retirementAgeText.split(" ")[0]
        return retirementAge.substring(retirementAge, retirementAge.length - 2);
    }

}

module.exports = RuleLoader;
