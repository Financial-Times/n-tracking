# Page attention

## What?

Captures the rough length of time a user is active on a page and how far they scrolled.


## Why?

Journalists want to know if visitors are reading their articles. We record  the time a user spends interacting with the page and how far they scroll so that this data can be used to calculate whether a page view was also a [quality read]. The quality read metric is surfaced in [Lantern].

[quality read]: https://docs.google.com/document/d/1hkU31FTEQmsRCqVzQebEf--QCw4QncMtutYxdGw8QmE/edit
[Lantern]: https://lantern.ft.com/


## When?

Attention timing:

- Since August 2015 (as `n-instrumentation`)
- Since July 2016 (as [`n-ui`])
- Since January 2020 (as [`n-tracking`])

Scroll depth:

- Since June 2015 (as [`next-article`])
- Since March 2017 (as [`n-ui`])
- Since January 2020 (as [`n-tracking`])


[`n-ui`]: https://github.com/Financial-Times/n-ui/pull/216
[`n-tracking`]: https://github.com/Financial-Times/n-tracking/pull/35
[`next-article`]: https://github.com/Financial-Times/next-article/pull/543


## Who?

- Chris Brown
- Matt Hinchliffe
- Matt Chadburn (original implementation)


## How?

Import and initialise the tracker from the `n-tracking` library:

```js
import * as nTracking from '@financial-times/n-tracking';

nTracking.trackers.pageAttention();
```

The `pageAttention()` method accepts an options object with the following properties:

| Option | Required | Type    | Description                                               |
|--------|----------|---------|-----------------------------------------------------------|
| target | No       | String  | Target element selector to apply scroll depth markers to. |
| debug  | No       | Boolean | Enable verbose logs for attention events                  |

This script will internally initialise two components:

1. ### Attention time
    This sets a timer for each "attention" event detected on the page. Attention events include clicks, mouse movement, and touches. The timer is restarted each time an attention event occurs. The timer will stop either automatically after 15 seconds or by an "attention lost" event. Each time attention ends the total attention time is recalculated. A `page:interaction` event is triggered when the page is unloaded.

2. ### Scroll depth
    This creates a number of marker elements at equal intervals down the page. The first time a marker is scrolled into the browser's viewport a `page:scrolldepth` event is triggered. Each scroll depth event also includes the current attention time.


## More details

The attention time feature was originally implemented as part of the `n-instrumentation` package which was merged into `n-ui` in 2016. No archive of the `n-instrumentation` package exists but we do know the original implementation was partially based on this blog post: http://upworthy.github.io/2014/06/implementing-attention-minutes-part-1/

The scroll depth feature was initially added to the `next-article` application and merged into `n-ui` in 2016.
