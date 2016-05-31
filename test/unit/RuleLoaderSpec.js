'use strict';

describe("Rule Loader", () => {

    const RuleLoader = require("../../src/RuleLoader");
    var loader;
    const fs = require("fs");
    const moment = require("moment");

    beforeEach(() => {
        loader = new RuleLoader();
    });

    afterEach(() => {
    });

    it("should load in rules successfully when parsing date of retirement", () => {

        expect(loader.loadFile("test/unit/resources/simpleRuleSet.tsv")).toEqual([
          {
            from: moment.utc("06-04-1950", "DD[-]MM[-]YYYY").startOf("day").toDate().getTime(),
            to: moment.utc("05-05-1950", "DD[-]MM[-]YYYY").endOf("day").toDate().getTime(),
            gender: "F",
            ageOfRetirement: null,
            dateOfRetirement: moment.utc("06-06-2010", "DD[-]MM[-]YYYY").startOf("day").toDate().getTime()
          }
        ]);

        it("should load in rules successfully when parsing age of retirement", () => {

            expect(loader.loadFile("test/unit/resources/simpleRuleSetAgeOfRetirement.tsv")).toEqual([
              {
                from: moment.utc("31-12-1899", "DD[-]MM[-]YYYY").startOf("day").toDate().getTime(),
                to: moment.utc("05-12-1953", "DD[-]MM[-]YYYY").endOf("day").toDate().getTime(),
                gender: "M",
                ageOfRetirement: 65,
                dateOfRetirement: null
              }
            ]);
        });
    });

});
