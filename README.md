# @financial-times/n-tracking [![CircleCI](https://circleci.com/gh/Financial-Times/n-tracking/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/n-tracking/tree/master)

This package provides client-side tracking initialisation for FT.com. It configures [o-tracking] (which is used to capture and send tracking events to [Spoor]) with the provided and automatically inferred context data. A server-side template is also provided which can be used to embed fallback tracking pixels into the page.

[o-tracking]: https://github.com/Financial-Times/o-tracking
[Spoor]: https://spoor-docs.herokuapp.com/


## Getting started

This package is for client-side and server-side use and is distributed on npm.

```sh
npm install -S @financial-times/n-tracking
```

After installing the package you can import the tracking component into your code:

### Client-side integration

This is primarily used to configure [o-tracking] but the client-side integration also provides a utility to trigger custom events.

```js
import * as tracking from '@financial-times/n-tracking';

const oTracking = tracking.init(options);
```

To initialise the component you'll need to provide it with several [configuration options](#options).


### Server-side integration

The server-side integration can be used to embed tracking pixels into the page which send page view events for visits which do not support JS or an enhanced experience.

```jsx
const { CoreTracking } = require('@financial-times/n-tracking');

<CoreTracking options={options} />
```

To initialise the component you'll need to provide it with several [configuration options](#options).


## API

### `init(options)`

Configures [o-tracking] with the given [options](#options), triggers a page view event, initialises click tracking, and returns the instance of [o-tracking].

### `broadcast(name, data)`

Creates a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) with the given name and data and dispatches it from the document `<body>` element. It is intended to be used to trigger `oTracking.event` events.

### `trackers.customTrackerName()`

TODO: custom tracking events to be used across FT.com


## Options

Property       | Type   | Required | Description
---------------|--------|----------|------------------------------------------------------------------
`appContext`   | Object | Yes      | [FT.com App Context] data describing the current page which will be appended to all captured events.
`extraContext` | Object | No       | Additional data describing the current page which will be appended to all captured events.
`pageViewContext` | Object | No | Additional data to append to the page view event only

[FT.com App Context]: https://github.com/Financial-Times/dotcom-page-kit/blob/master/packages/dotcom-server-app-context/schema.md


## Automatically inferred data

- Marketing query string parameters inc. cost-per-click and segment IDs
- User data inc. layout, screen orientation, and connection type
- Error page parameters inc. error code and error message
