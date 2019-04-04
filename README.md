# n-tracking

...

## Installation

```
npm install --save @financial-times/n-tracking
```

## Usage

```js
import tracking from "@financial-times/n-tracking";
import scrollTracking from "@financial-times/n-tracking/scroll";
import copyTracking from "@financial-times/n-tracking/copy";

const events = [scrollTracking, copyTracking];

tracking.init({ events });
```
