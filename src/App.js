'use strict';

const RuleLoader = require("./RuleLoader");
const _ = require("lodash");
const moment = require("moment");
const RULES_CSV = "../testData/rules.tsv";

class App {

    constructor(express){

        this.express = express();

        this.loader = new RuleLoader();
        this.rules = this.loader.loadFile(require("path").join(__dirname, RULES_CSV));

        this.express.use(express.static('public'));

        this.express.get('/', function(req, res){
            res.send("index.html");
        });

        this.express.get('/pensionPlan', (req, res) => {

            if(!req.query.gender || !req.query.dateOfBirth){
                res.status(400).end();
                return;
            }

            let dateOfRetirement = this.calculateDateOfRetirement(req.query.gender, req.query.dateOfBirth);

            if(!dateOfRetirement){
                res.status(404).end();
                return;
            }

            res.status(200).json({ dateOfRetirement: dateOfRetirement });
        });

        this.express.listen(3001);
    }

    calculateDateOfRetirement(gender, dateOfBirth){

        let parsedDateOfBirth = moment.utc(dateOfBirth, "YYYY[-]MM[-]DD").toDate().getTime();

        let ruleMatched = _.find(this.rules, (rule) => {
            return (parsedDateOfBirth >= rule.from && parsedDateOfBirth <= rule.to && rule.gender.indexOf(gender) > -1);
        });

        if (!ruleMatched){
            return null;
        }

        if (ruleMatched && ruleMatched.ageOfRetirement !== null){
            return moment.utc(parsedDateOfBirth).add(ruleMatched.ageOfRetirement, "years").format("YYYY[-]MM[-]DD");
        }

        return moment.utc(ruleMatched.dateOfRetirement).format("YYYY[-]MM[-]DD");
    }

    getApp(){
        return this.express;
    }

}

module.exports = App;
