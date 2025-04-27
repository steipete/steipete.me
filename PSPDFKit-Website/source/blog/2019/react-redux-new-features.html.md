---
title: "React Redux's New Features"
description: "An overview of React Redux's seven new features in action."
preview_image: /images/blog/2019/react-redux-new-features/article-header.png
section: blog
author:
  - Miguel Calderon
author_url:
  - https://github.com/miguelcalderon
date: 2019-08-07 8:00 UTC
tags: Web, Development, How-To, React, React Redux
published: true
secret: false
---

One of the libraries we’ve used for a long time at PSPDFKit for Web in combination with `react` itself is `react-redux`, so we have been understandably excited by [the release of v7][], which came out earlier this year.

The previous version, `react-redux` v6, brought support for the new [React Context API][] to the package. However, there were some important performance issues that have been solved with the release of v7.

On top of that, the recently released [`react-redux@7.1.0`][] includes a set of custom hooks, like [`useSelector`][] and [`useDispatch`][], that can now replace connect calls in function components.

Moreover, `react-redux` now also exports a new [`batch()`][] function. But what does it do?

## React Batched Updates

As the package maintainers explain, `batch()` is nothing more than a forwarded export of `react-dom`’s [`unstable_batchedUpdates()`][], a React utility used to wrap `setState()` calls so that React components will only render once they’re finished.

Keep in mind that React component state changes [will soon be batched by default][], and you will have to opt out of batching instead of opting in. This is a change that makes sense: It allows you to perform fewer renders and avoid invalid or transitional states, especially if there are several state updates to perform.

There’s a caveat for this feature though: all state changes inside the batch function must be synchronous, and that goes for dispatching Redux actions too. The reason is that, once the batch callback has returned, all state updates are flushed, and components will render without waiting for asynchronous calls to resolve.

## The Example

In order to get a small glimpse of how React code may look when using the new `react-redux` features, we will walk through a [small snippet we’ve put together][]. You can play around with it, try other custom hooks as well, and batch and unbatch dispatches.

The example code fetches a user’s geolocation data and then grabs a short text from Wikipedia about the user’s city reported by the geolocation API. Once both pieces of data are available, they’re processed and shown to the user. This may not seem very exciting, but there aren’t that many open APIs out there to play with — that is, APIs that not only are free, but also do not require an API key to be accessed.

For this example, we have chosen [`geojs.io`][] and the [Wikipedia API][], which are easy enough to access for our purpose.

The “imports” part of the code has been left out of the article. You’ll notice there are no exports either; that’s because all the code, being as simple as it gets, fits easily in a single file. 😃

### Actions

The only action creator in our example is in charge of retrieving all the necessary data. It resets the state and then fetches both APIs sequentially, as we need the city name first before we can get its information from Wikipedia:

```js
function getUserWeatherData() {
  return async function(dispatch) {
    // Reset state.
    batch(() => {
      dispatch({ type: "SET_CITY", city: null });
      dispatch({ type: "SET_CITYDATA", cityData: null });
    });
    // Fetch geolocation data.
    const geolocation = await fetch("https://get.geojs.io/v1/ip/geo.json").then(
      res => res.json()
    );
    // Fetch city data.
    const wikiData = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${geolocation.city}&limit=1&namespace=0&format=json&origin=*`
    ).then(res => res.json());
    // Dispatch actions.
    batch(() => {
      dispatch({ type: "SET_CITY", city: geolocation.city });
      dispatch({ type: "SET_CITYDATA", cityData: wikiData });
    });
  };
}
```

If you “unbatch” the `dispatch` calls, you won’t notice any visual difference, but you can check that each of them will trigger an update, while batching them will only trigger one at the end of the batch.

### Reducers

There’s nothing new or interesting about this part — we just set the state with the action’s payload:

```js
export const data = (state = {}, action) => {
  switch (action.type) {
    case "SET_CITY":
      return { ...state, city: action.city };
    case "SET_CITYDATA":
      return { ...state, cityData: action.cityData };
    default:
      return state;
  }
};
```

### Store

Same here. We add the `thunk` middleware to our store:

```js
const initialState = {
  city: null,
  cityData: null
};
const store = createStore(data, initialState, applyMiddleware(thunk));
```

### App

The main part of the code is where the interesting part of the example is: We’ll make use of the new custom hooks in our `App` component to get data from the Redux store.

For simplicity’s sake, this component is directly wrapped by `Provider` (which is still needed to work with `react-redux`), but in the Real World&trade; you’ll obviously be getting data from the store in much deeper levels of the tree.

But our `App` component is not wrapped by a `connect()` call; instead, it calls the `useSelector()` hook from inside the component function, which subscribes our component to the Redux store and makes sure the component will render each time the state updates.

The argument for `useSelector()` is similar to a `mapStateToProps()` function, with the difference that it can return any value we want; we are not limited to returning an object like we are when using `connect()`. In this case, there’s no data transformation needed, so we just return the same state object.

Since we are not using `react-redux`’s `connect()` now, we are not receiving a `dispatch` function in the `props`. So how do we dispatch an action from our component? We can now make use of `useDispatch()`, which will return a `dispatch` function for our use:

```js
function App() {
  const { cityData, city } = useSelector(data => data);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getUserWeatherData());
  }, [dispatch]);
  return city && cityData ? (
    <div>
      <p>City: {city}</p>
      <p>
        Facts:
        {cityData.map(text => (
          <p>{text}</p>
        ))}
      </p>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

## Conclusion

At PSPDFKit, we like to test and play with our tools and share our findings and experience. We have quickly walked through some of `react-redux`’s new features, but there’s still more to discover. We’ll let you know about it as we continue trying and, ultimately, using them.

[the release of v7]: https://github.com/reduxjs/react-redux/releases/tag/v7.0.1
[react context api]: https://reactjs.org/docs/context.html
[`react-redux@7.1.0`]: https://github.com/reduxjs/react-redux/releases/tag/v7.1.0
[`useselector`]: https://react-redux.js.org/next/api/hooks#useselector
[`usedispatch`]: https://react-redux.js.org/next/api/hooks#usedispatch
[`batch()`]: https://react-redux.js.org/api/batch
[`unstable_batchedupdates()`]: https://github.com/facebook/react/blob/a457e02ae3a2d3903fcf8748380b1cc293a2445e/packages/react-dom/src/client/ReactDOM.js
[will soon be batched by default]: https://overreacted.io/react-as-a-ui-runtime/
[small snippet we’ve put together]: https://codesandbox.io/s/react-redux-batched-updates-yn422
[`geojs.io`]: https://www.geojs.io/
[wikipedia api]: https://www.mediawiki.org/wiki/API:Main_page
