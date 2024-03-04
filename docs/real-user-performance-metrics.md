# Real user performance metrics

## What?

Capture the performance metrics from user's browsers and send them to Spoor.


## Why?

We want to know if and how web page performance affects how users interact with FT.com. A previous test in 2016 showed that regularly delaying loading by displaying a blank white screen had a significant negative effect on users’ RFV score. However, this test only covered one aspect of web page performance and does not account for the impact of certain features or third party and advertising code.

Our primary goals are:

1. To enable everybody who helps deliver FT.com to have informed conversations about the performance impact of features added to FT.com and how this may ultimately affect revenue or user engagement.
2. Improve the PageSpeed score of FT.com in order to increase our Google PageRank. Since 2016 the definition of web performance as dictated by Google (and enforced by their Lighthouse tool which is used to calculate PageSpeed and thus influences PageRank) has changed and we have not been scoring highly for some time.


## When?

Starting Q1 2020

## Who?

- Matt Hinchliffe
- Bren Brightwell
- Adam Braimbridge


## How?

Import and initialise the tracker from the `n-tracking` library, please note this should always be done behind the `realUserMonitoringForPerformance` flag:

```js
import * as nTracking from '@financial-times/n-tracking';

if (flags.get('realUserMonitoringForPerformance')) {
  nTracking.trackers.realUserMonitoringForPerformance();
}
```

This script will detect whether the browser supports performance timing, sample users based on their allocated Spoor ID, and initialise [web-vitals](https://www.npmjs.com/package/web-vitals) to calculate the metrics.

Once all metrics have been collected a `page:performance` event will be triggered and sent to Spoor.


## More details

A methodology and event data spec can be found here:
https://docs.google.com/document/d/1jG9f2DHs1AH-5kiV2cscpcheOckPM5EbzGA17uEGm9M/edit#

## With attribution

The above approach has a few issues: Firstly it takes the first bunch of events and sends them, whereas you want to capture the last events if possible.

Secondly, it doesn't tell us _why_ these values are what they are.

The workaround is to provide a more comprehensive real user monitoring option, which can be used simultaneously with the previous option.

The workaround utilises Web vital [attribution](https://www.npmjs.com/package/web-vitals#send-attribution-data) to these events, which helps determine what causes the scores, and can send multiple events of the same type per user.

To use this, alongside the previous option:

```js
import * as nTracking from '@financial-times/n-tracking';

if (flags.get('realUserMonitoringForPerformance')) {
  nTracking.trackers.realUserMonitoringForPerformance();
  nTracking.trackers.realUserMonitoringWithAttribution();
}
```