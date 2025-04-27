---
title: "Restoring State in Android MVP Architecture"
description: "State restoration is an important part of the Android framework, but we might encounter problems with it when implementing MVP architecture."
section: blog
author:
 - Ivan Skoric
author_url:
 - https://twitter.com/skoric_
date: 2016-11-10 12:00 UTC
tags: Android, Development, Java, Kotlin, MVP
published: true
---

State restoration in an Android app developed with the MVP (Model-View-Presenter) pattern can sometimes get tricky if you want to keep the architecture clean. One such example would be when a presenter needs to be made aware of the state. READMORE

Android already has a mechanism for storing and receiving objects from the [`Bundle`][0], which can be used to restore state. The presenter, on the other hand, shouldn’t depend on any Android classes. This enables better abstraction and testability with pure Java unit tests.

If you search around, you’ll find various approaches to restoring state in MVP architecture, but either they don’t use the default Android state restoration mechanism, they keep the presenter dependent of the platform, or they’re just ugly workarounds:

* [Providing `Bundle` to the presenter](https://github.com/nuuneoi/MVPStructure)
* [Storing presenters in a singleton map](https://www.reddit.com/r/androiddev/comments/3aeva9/mvp_saving_state_in_presenter_and_retaining/)
* [Having an entire activity lifecycle passed to the presenter](http://blog.bradcampbell.nz/mvp-presenters-that-survive-configuration-changes-part-2/)
*  [Preserving presenters in loaders](https://medium.com/@czyrux/presenter-surviving-orientation-changes-with-loaders-6da6d86ffbbf#.qkc4r89by)

## The Initial Structure

This article tries to solve the problem of state restoration in MVP architecture by introducing presenters that can have a state — otherwise referred to as stateful presenters. These presenters can optionally receive the state from the `View`. Additionally, they expose the state getter method so that the `View` can retrieve the state from the presenter at any point.

On Android, the view will usually be an [`Activity`][1], a [`Fragment`][2], or a custom view, all of which have a built-in mechanism for restoring state. We’ll use that mechanism to restore the state retrieved from the presenter. The state itself will be an implementation of the `BaseState` interface added to the already existing `BaseModel`, `BaseView`, and `BasePresenter`.

State implementations are also independent of the Android platform. Due to this independence, we can mock states and run pure Java unit tests with a mocked state restoration process without having to include the Android framework at all (assuming Android state restoration works correctly).

Let’s get to some code. This is the usual structure seen in apps using the MVP architecture (nomenclature can vary, but the principle is similar or the same):

[==

```kotlin
// BaseView.kt
interface BaseView {}

// BaseModel.kt
interface BaseModel {}

// BasePresenter.kt
interface BasePresenter<in V: BaseView> {
    fun subscribe(view: V)
    fun unsubscribe()
}
```

```java
// BaseView.java
interface BaseView {}

// BaseModel.java
interface BaseModel {}

// BasePresenter.java
interface BasePresenter<V extends BaseView> {
    void subscribe(@NonNull V view);
    void unsubscribe();
}
```

==]

To this structure, we add state representation and a presenter that can both receive and provide the state:

[==

```kotlin
// BaseState.kt
interface BaseState {}

// BaseStatefulPresenter.kt
interface BaseStatefulPresenter<in V: BaseView, S: BaseState>: BasePresenter<V> {
    fun subscribe(view: V, state: S?)
    fun getState(): S
}
```

```java
// BaseState.java
interface BaseState {}

// BaseStatefulPresenter.java
interface BaseStatefulPresenter<V extends BaseView, S extends BaseState> extends BasePresenter<V> {
    void subscribe(@NonNull V view, @Nullable S state);
    @NonNull S getState();
}
```

==]

## An Example

Now let’s see a real-world example. Say we have a `TabLayout` displaying tabs and we want to
restore them when the view (the activity in this case) is restored. Also, we want to restore the last selected tab position.

(Note: Usually we wouldn’t restore a couple of tab items, but let’s go with it for the purpose of this example.)

### Setup

First, we can declare a simple contract for tab handling:

[==

```kotlin
interface TabsContract {
    interface View: BaseView {
        fun setTabItems(items: List<TabItem>)
        fun setTabPosition(position: Int)
    }

    interface State: BaseState {
        fun getLastTabItems(): List<TabItem>?
        fun getLastTabPosition(): Int?
    }

    interface Model: BaseModel {
        fun getTabItems(): List<TabItem>
    }

    interface Presenter: BaseStatefulPresenter<View, State> {
        fun onTabPositionChange(position: Int)
    }
}
```

```java
interface TabsContract {
    interface View extends BaseView {
        void setTabItems(List<TabItem> items);
        void setTabPosition(int position);
    }

    interface State extends BaseState {
        List<TabItem> getLastTabItems();
        int getLastTabPosition();
    }

    interface Model extends BaseModel {
        List<TabItem> provideTabItems();
    }

    interface Presenter extends BaseStatefulPresenter<View, State> {
        void onTabPositionChange(int position);
    }
}
```

==]

### State

In this example, we want to restore the tab items and position of the last selected tab, so that’s how we construct the `TabState`. Also, immutability is preferred:

[==

```kotlin
class TabsState(private val tabItems: List<TabItem>?, private val tabPosition: Int?): TabsContract.State {
    override fun getTabItems() = tabItems
    override fun getTabPosition() = tabPosition
}
```

```java
class TabsState implements TabsContract.State {
    private final List<TabItem> tabItems;
    private final int tabPosition;

    public TabsState(List<TabItem> tabItems, int tabPosition) {
        this.tabItems = tabItems;
        this.tabPosition = tabPosition;
    }

    @Override public List<TabItem> getTabItems() {
        return tabItems;
    }

    @Override public int getTabPosition() {
        return tabPosition;
    }
}
```

==]

### Stateful Presenter

A stateful presenter can receive the state from the view when it subscribes. In this example, we check if items are provided by the state. If not, we’ll load them from the model. Also, if there’s a last saved position, we’ll set it on the view as well. Unrelated code (including dependency injection) is omitted for brevity:

[==

```kotlin
class TabPresenter: TabsContract.Presenter {
    private var view: TabsContract.View? = null
    private val model = TabsContract.Model()

    private var tabItems: List<TabItem>? = null
    private var tabPosition: Int? = null

    // Subscribe without the state.
    override fun subscribe(view: TabsContract.View) = subscribe(view, null)

    // Subscribe with the provided state.
    override fun subscribe(view: TabsContract.View, state: TabsContract.State?) {
        this.view = view

        // If there are no retrieved items, get them from the model.
        tabItems = state?.getLastTabItems() ?: model.getTabItems()

        // Set items on the view.
        this.view?.setTabItems(tabItems!!)

        // If there's a last saved position, set it on the view as well, set to 0 by default.
        val retrievedLastPosition = state?.getLastPosition()
        if (retrievedLastPosition != null) {
            this.view?.setTabPosition(retrievedLastPosition)
        }
    }

    // Once the state is requested, generate a new immutable state instance.
    override fun getState(): TabsContract.State = TabsState(tabItems, tabPosition)

    // Unsubscribe the view from the presenter.
    override fun unsubscribe() {
        view = null

        // Clear state variables when unsubscribed. The view is no longer associated with this
        // presenter, so the presenter shouldn't keep the track of the state.
        tabItems = null
        tabPosition = null
    }

    // Called by the view when the tab position changes.
    override fun onTabPositionChange(position: Int) {
        tabPosition = position

        // For example, update the toolbar title once the selected tab changes.
        val titleRes = tabItems?.get(position)?.title
        if (titleRes != null) {
            view?.setToolbarTitle(titleRes)
        }
    }
}
```

```java
class TabPresenter implements TabsContract.Presenter {
    @Nullable private TabsContract.View view;
    private TabsContract.Model model = new TabsContract.Model();

    @Nullable private List<TabItem> tabItems;
    private int lastPosition;

    // Subscribe without the state.
    @Override void subscribe(@NonNull TabsContract.View view) {
        subscribe(view, null);
    }

    // Subscribe with the provided state.
    @Override void subscribe(@NonNull TabsContract.View view, @Nullable TabsContract.State state) {
        this.view = view;

        // If there are no retrieved items, get them from the model. If there's no
        // previously selected position, use 0 as a default one.
        final int retrievedPosition;
        if (state != null) {
            tabItems = state.getLastTabItems();
            retrievedPosition = state.getLastTabPosition();
        } else {
            tabItems = model.getTabItems();
            retrievedPosition = 0;
        }

        // Set the values on the view.
        view.setTabItems(tabItems);
        view.setTabPosition(retrievedPosition);
    }

    // Once the state is requested, generate a new immutable state instance.
    @Override TabsContract.State getState() {
        return new TabsState(tabItems, tabPosition);
    }

    // Unsubscribe the view from the presenter.
    @Override void unsubscribe() {
        view = null;

        // Clear state variables when unsubscribed. The view is no longer associated with this
        // presenter, so the presenter shouldn't keep the track of the state.
        tabItems = null;
        tabPosition = null;
    }

    // Called by the view when the tab position changes.
    @Override void onTabPositionChange(int position) {
        tabPosition = position;

        // For example, update the toolbar title once the selected tab changes.
        if (tabItems != null && tabItems.get(position) != null) {
            view.setToolbarTitle(tabItems.get(position).getTitle());
        }
    }
}
```

==]

### View Implementation

In our `View`, which will be an [`Activity`][1] in our example, we handle presenter interactions within three activity lifecycle methods, called in this order:

* [`onPostCreate()`][4]
* [`onSaveInstanceState()`][5]
* [`onStop()`][6]

The usual practice with a stateless subscriber is to subscribe to the presenter in [`onResume()`][8] and unsubscribe from it in [`onPause()`][9]. This can be problematic with the stateful presenter because [`onSaveInstanceState()`][5] isn’t necessarily called before [`onPause()`][9] is, and unsubscribing before retrieving the state there is a bit unintuitive.

We can create an easy workaround by getting the state reference in [`onPause()`][9] and then
checking in [`onSaveInstanceState()`][5] to see whether or not it was previously stored.

A cleaner solution is to subscribe to the presenter in [`onPostCreate()`][4] and unsubscribe in
[`onStop()`][6], which is always called after [`onSaveInstanceState()`][5]. Notice that [`onSaveInstanceState()`][5] might not be called at all if no state needs to be saved — like when navigating back in the app.

Note that [`onPostCreate()`][4] receives the same bundle as [`onRestoreInstanceState()`][3], which was called before it. The bundle is `null` if there was no previously saved state. That’s very handy for our use case.

Here’s an example of the view implementation:

[==

```kotlin
class TabView : AppCompatActivity(), TabsContract.View, ViewPager.OnPageChangeListener {

	// ...

    override fun onPostCreate(savedInstanceState: Bundle?) {
        super.onPostCreate(savedInstanceState)

        // Pass state when subscribing; it can be null.
        presenter.subscribe(this, if (savedInstanceState != null) readFromBundle(savedInstanceState) else null)
    }

    override fun onSaveInstanceState(outState: Bundle?) {
        super.onSaveInstanceState(outState)

        // When saving state, retrieve it from the presenter and save to Bundle.
        writeToBundle(outState, presenter.getState())
    }

    override fun onStop() {
        super.onStop()

        // Unsubscribe from the presenter once the activity is stopped.
        presenter.unsubscribe()
    }

    override fun setTabItems(items: List<TabItem>) {
        tabPagerAdapter.setTabItems(items)
    }

    override fun setTabPosition(position: Int) {
        tabLayout.setScrollPosition(position, 0f, true)
        tabPager.currentItem = position
    }

    // Tab listener notifying the presenter of the change.
    override fun onPageSelected(position: Int) {
        presenter.onTabPositionChange(position)
    }
}
```

```java
class TabView extends AppCompatActivity() implements TabsContract.View, ViewPager.OnPageChangeListener {

	// ...

    @Override public void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate();

        // Pass state when subscribing; it can be null.
        presenter.subscribe(this, savedInstanceState != null ? readFromBundle(savedInstanceState) : null);
    }

    @Override public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        // When saving state, retrieve it from the presenter and save to Bundle.
        writeToBundle(outState, presenter.getState());
    }

    @Override public void onStop() {
        super.onStop();

        // Unsubscribe from the presenter once the activity is stopped.
        presenter.unsubscribe();
    }

    @Override public void setTabItems(List<TabItem> items) {
        tabPagerAdapter.setTabItems(items);
    }

    @Override public void setTabPosition(int position) {
        tabLayout.setScrollPosition(position, 0f, true);
        tabPager.setCurrentItem(position);
    }

    // Tab listener notifying the presenter of the change.
    @Override public void onPageSelected(int position) {
        presenter.onTabPositionChange(position);
    }
}
```

==]

The methods `writeToBundle()` and `readToBundle()` are just helper methods for writing `State` to the bundle, and they are used to avoid code clutter (this implementation is omitted since it’s trivial).

You could also make state implement [`Parcelable`][7], but then you would be dependent on the Android platform, which is not what you want in this case.

## Conclusion

The architecture presented in this article tries to incorporate the Android state restoration problem into the MVP model while keeping the components independent of the platform. This approach doesn’t force the state on the presenter (you still have the old `BasePresenter` for stateless implementation), but rather provides presenters that need to manage the state. Stateful presenters are aware of their state through the provided interface without knowing anything about the underlying implementation. By following this pattern, you’ll keep your MVP architecture as it should be by definition, and you’ll get state restoration at the cost of few extra lines of code.

[0]: https://developer.android.com/reference/android/os/Bundle.html
[1]: https://developer.android.com/reference/android/app/Activity.html
[2]: https://developer.android.com/reference/android/app/Fragment.html
[3]: https://developer.android.com/reference/android/app/Activity.html#onRestoreInstanceState(android.os.Bundle)
[4]: https://developer.android.com/reference/android/app/Activity.html#onPostCreate(android.os.Bundle)
[5]: https://developer.android.com/reference/android/app/Activity.html#onSaveInstanceState(android.os.Bundle)
[6]: https://developer.android.com/reference/android/app/Activity.html#onStop()
[7]: https://developer.android.com/reference/android/os/Parcelable.html
[8]: https://developer.android.com/reference/android/app/Activity.html#onResume()
[9]: https://developer.android.com/reference/android/app/Activity.html#onPause()
