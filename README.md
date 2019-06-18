# n-tracking

This package provides client-side tracking initialisation and some shared events for FT.com. It initialises [o-tracking] (which is used to capture and send tracking events to [Spoor]) with the provided and automatically inferred context data.

[o-tracking]: https://github.com/Financial-Times/o-tracking
[Spoor]: https://spoor-docs.herokuapp.com/


## Getting started

This package is for client-side use and is distributed on Bower.

```sh
bower install -S n-tracking
```

After installing the package you can import the tracking component into your client-side code:

```js
import * as tracking from '@financial-times/n-tracking';

tracking.init(options);
```

To initialise the component you'll need to provide it with several [configuration options](#options).


## API

### `init(options)`

Configures [o-tracking] with the given [options](#options) and returns the instance of [o-tracking].

### `broadcast(name, data)`

Creates a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) with the given name and data and dispatches it from the document `<body>` element. It is intended to be used to trigger `oTracking.event` events.


## Options

Property     | Type   | Required | Description
-------------|--------|----------|---------------------------------------------------
`appContext` | Object | Yes      | [FT.com App Context] data describing the current page.
`flags`      | Object | No       | Data from the [Next flags API].

[FT.com App Context schema]: https://github.com/Financial-Times/anvil/blob/master/packages/anvil-server-ft-app-context/schema.md
[Next flags API]: https://github.com/Financial-Times/next-flags-api
