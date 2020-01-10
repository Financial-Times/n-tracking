# Text copying

## What?

Listens for text highlight and copy events on content pages.


## Why?

We want to know how many subscribers appear to be copying above the threshold defined in our the [copyright policy] and stop those that are offending. The [Prospector project] aims to turn this potentially negative behaviour from B2C subs into an opportunity for B2B business.

[copyright policy]: https://help.ft.com/help/legal-privacy/copyright/copyright-policy/
[Prospector project]: https://github.com/Financial-Times/ip-prospector


## When?

- Since August 2015 (as `n-instrumentation`)
- Since July 2016 (as [`n-ui`])
- Since January 2020 (as [`n-tracking`])

[`n-ui`]: https://github.com/Financial-Times/n-ui/pull/216
[`n-tracking`]: https://github.com/Financial-Times/n-tracking/pull/35


## Who?

- Ray Tagoe, Philippa Payne, Kiya Gurmesa (internal products)
- Matt Hinchliffe (customer products)
- Mark Stephens/Tom Parker/Matt Chadburn (first implementation)


## How?

Import and initialise the tracker from the `n-tracking` library, please note this should always be done behind the `textCopyTracking` flag:

```js
import * as nTracking from '@financial-times/n-tracking';

if (flags.get('textCopyTracking')) {
    nTracking.trackers.textCopying();
}
```


## More details

This original implementation was intended to replace a third-party library for performance and privacy reasons.

More information about the FT's copyright program can be found here: https://docs.google.com/presentation/d/1WieqpEYvossMecte26tUPQK7CzWa-9SMGpyGQyzL738/edit?usp=sharing
