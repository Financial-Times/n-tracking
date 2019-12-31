# @financial-times/n-tracking [![CircleCI](https://circleci.com/gh/Financial-Times/n-tracking/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-tracking/tree/master)

This package provides tracking initialisation for FT.com. On the client-side it configures [o-tracking] (which is used to capture and send tracking events to [Spoor]) and for the server-side it provides components which render fallback tracking pixels .

[o-tracking]: https://github.com/Financial-Times/o-tracking
[Spoor]: https://spoor-docs.herokuapp.com/


## Getting started

This package is for client-side and server-side use and is distributed on npm.

```sh
npm install -S @financial-times/n-tracking
```

After installing the package you can import the tracking component into your code:

### Client-side integration

**Configure [o-tracking]**

This package can be used on the client-side. Initialise the component with [configuration options](#options).

```js
import * as nTracking from '@financial-times/n-tracking';
const options = {}
const oTracking = nTracking.init(options); 
```
 
**Send custom events**

```js
import * as nTracking from '@financial-times/n-tracking';
const context = { customData: 12345 }
nTracking.broadcast('oTracking.event', {
  category: 'page',
  action: 'custom-event',
  ...context
});
```

**Send real-user-monitoring (RUM) performance metrics**

```js
import * as nTracking from '@financial-times/n-tracking';
if (flags.get('realUserMonitoringForPerformance')) {
	nTracking.trackers.realUserMonitoringForPerformance();
}
```
<div><img width="70%" src="https://user-images.githubusercontent.com/224547/71626767-c709c480-2be6-11ea-91a5-506972a3b4d7.png" /></div>

_Above: Real-user-monitoring performance metrics are sent to spoor-api._ 

### Server-side integration

On the server-side a JSX component embeds tracking pixels into the page which send page view events for any visitors which do not support JS or fail to cut the mustard.

```jsx
const { CoreTracking } = require('@financial-times/n-tracking');

<CoreTracking {...options} />
```

To initialise the component you'll need to provide it with several [configuration options](#options).


## Client-side API

### `init(options)`

Configures [o-tracking] with the given [options](#options), triggers a page view event, initialises click tracking, and returns the instance of [o-tracking].

### `broadcast(name, data)`

Creates a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) with the given name and data and dispatches it from the document `<body>` element. It is intended to be used to trigger `oTracking.event` events.

### `trackers.customTrackerName()`

TODO: custom tracking events to be used across FT.com


## Server-side API

### `<CoreTracking />`

Renders a `<noscript>` and inline `<script>` element to embed fallback tracking pixels into the page which can be used when the client-side JS fails to run. It accepts the same [options](#options) as the client-side code.


## Options

Property          | Type   | Required | Description
------------------|--------|----------|------------------------------------------------------------------
`appContext`      | Object | Yes      | [FT.com App Context] data describing the current page which will be appended to all captured events.
`extraContext`    | Object | No       | Additional data describing the current page which will be appended to all captured events.
`pageViewContext` | Object | No       | Additional data to append to the page view event only

[FT.com App Context]: https://github.com/Financial-Times/dotcom-page-kit/blob/master/packages/dotcom-server-app-context/schema.md


## Automatically inferred data

- Marketing query string parameters inc. cost-per-click and segment IDs
- User data inc. layout, screen orientation, and connection type
- Error page parameters inc. error code and error message
