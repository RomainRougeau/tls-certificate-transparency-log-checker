"use strict";

// Core deps
import fs from "fs";
import path from "path";

// 3rd party deps
import test from "ava";

import nock from "nock";

// Local deps
import {checkCTLogs} from "../dist/lib/tls-certificate-transparency-log-checker-lib.js";
import config from "../config/tls-certificate-transparency-log-checker-config.js"; // NOTE: Path is relative to build dir (dist/)

const nowTS = parseInt(new Date().getTime() / 1000, 10);

test.cb("checkCTLogs with valid inputs (1)", (t) =>
{
    // NOTE: These 2 nocks must match the domainNamePatterns in the test config file
    nock("https://crt.sh")
    .get("/atom?identity=%.bbc.co.uk") // i think this can be a regex
    .reply(200, function replyFn(uri, requestBody) // eslint-disable-line no-unused-vars
    {
        return fs.createReadStream(path.join(__dirname, "fixtures/rss-valid-1.xml"));
    });

    nock("https://crt.sh")
    .get("/atom?identity=%.bbc.com") // i think this can be a regex
    .reply(200, function replyFn(uri, requestBody) // eslint-disable-line no-unused-vars
    {
        return fs.createReadStream(path.join(__dirname, "fixtures/rss-valid-1.xml"));
    });

    // Override the config values for readability - ???
    let ignoreCertsValidFromBeforeTS = 0;//nowTS - (86400 * 365); // Ignore certs from > 365 days ago
    let ignoreCertsValidToBeforeTS = 1471943287; // NOTE: we need to hard code this otherwise it changes over time

    checkCTLogs(config.domainNamePatterns, ignoreCertsValidFromBeforeTS, ignoreCertsValidToBeforeTS, config.expectedCAs, (checkCTLogsErr, checkCTLogsRes) =>
    {
        t.is(checkCTLogsErr === null, true, "checkCTLogsErr must be null");

        t.is(Object.keys(checkCTLogsRes).length === 3, true, "checkCTLogsRes must have 3 keys");

        t.is(Object.keys(checkCTLogsRes.allCerts).length === 2, true, "checkCTLogsRes.allCerts must have 2 keys");
        t.is(checkCTLogsRes.allCerts.count, 86, "checkCTLogsRes.allCerts.count must be 4 (due to data source)");
        t.is(Object.keys(checkCTLogsRes.allCerts.entries).length, checkCTLogsRes.allCerts.count, "checkCTLogsRes.allCerts.entries must have 4 keys (due to data source)");

        t.is(Object.keys(checkCTLogsRes.unexpectedCA).length === 2, true, "checkCTLogsRes.unexpectedCA must have 2 keys");
        t.is(checkCTLogsRes.unexpectedCA.count, 7, "checkCTLogsRes.unexpectedCA.count must be 4 (due to data source)");
        t.is(Object.keys(checkCTLogsRes.unexpectedCA.entries).length, checkCTLogsRes.unexpectedCA.count, "checkCTLogsRes.unexpectedCA.entries must have 4 keys (due to data source)");

        t.is(Object.keys(checkCTLogsRes.byCA).length === 2, true, "checkCTLogsRes.byCA must have 2 keys");
        t.is(checkCTLogsRes.byCA.count, 6, "checkCTLogsRes.byCA.count must be 4 (due to data source)");
        t.is(Object.keys(checkCTLogsRes.byCA.entries).length, checkCTLogsRes.byCA.count, "checkCTLogsRes.byCA.entries must have 4 keys (due to data source)");

        t.end();
    });
});

test.cb("checkCTLogs with invalid inputs (bogus summary data in XML)", (t) =>
{
    // NOTE: These 2 nocks must match the domainNamePatterns in the test config file
    nock("https://crt.sh")
    .get("/atom?identity=%.bbc.co.uk") // i think this can be a regex
    .reply(200, function replyFn(uri, requestBody) // eslint-disable-line no-unused-vars
    {
        return fs.createReadStream(path.join(__dirname, "fixtures/rss-invalid-1.xml"));
    });

    // Override the config values for readability - ???
    let ignoreCertsValidFromBeforeTS = nowTS - (86400 * 365); // Ignore certs from > 365 days ago
    let ignoreCertsValidToBeforeTS = nowTS;

    let domainNamePatterns =
    [
        "%.bbc.co.uk"
    ];

    checkCTLogs(domainNamePatterns, ignoreCertsValidFromBeforeTS, ignoreCertsValidToBeforeTS, config.expectedCAs, (checkCTLogsErr, checkCTLogsRes) =>
    {
        t.is(checkCTLogsErr === null, true, "checkCTLogsErr must be null"); // NOTE we don't want an error here otherwise we end up throwing errors when we find no certs
        t.is(Object.keys(checkCTLogsRes).length === 3, true, "checkCTLogsRes must have 3 keys"); // Basic check without repeating the above

        t.end();
    });
});

test.cb("checkCTLogs with HTTP 500 response from RSS endpoint", (t) =>
{
    // NOTE: These 2 nocks must match the domainNamePatterns in the test config file
    nock("https://crt.sh")
    .get("/atom?identity=%.bbc.co.uk") // i think this can be a regex
    .reply(500);

    // Override the config values for readability - ???
    let ignoreCertsValidFromBeforeTS = nowTS - (86400 * 365); // Ignore certs from > 365 days ago
    let ignoreCertsValidToBeforeTS = nowTS;

    let domainNamePatterns =
    [
        "%.bbc.co.uk"
    ];

    checkCTLogs(domainNamePatterns, ignoreCertsValidFromBeforeTS, ignoreCertsValidToBeforeTS, config.expectedCAs, (checkCTLogsErr, checkCTLogsRes) =>
    {
        t.is(checkCTLogsErr instanceof Error, true, "checkCTLogsErr must be an error");

        t.is(checkCTLogsRes === null, true, "checkCTLogsRes must be null");

        t.end();
    });
});
