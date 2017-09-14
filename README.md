# ngrx-store

This package contains undo functionality for [@ngrx/store (4+)](https://github.com/ngrx/platform).
The goal of this package is described in this blogpost [Cancellable optimistic updates in angular2 and redux](http://blog.brecht.io/Cancellable-optimistic-updates-in-Angular2-and-Redux/) written by [Brecht Billiet](http://brecht.io)


## Installation

```
$ npm install --save ngrx-undo
```


## Usage

The previous version of ngrx-undo was created for @ngrx/store 2 and was completely integrated with angular modules. Because the complete API got changed it seemed easier to keep it simple. For that reason we dropped the angular dependency and decided to keep the config a bit easier.

```typescript
import {handleUndo, configureBufferSize} from 'ngrx-undo';

// if you want to update the buffer (which defaults to 100)
configureBufferSize(150);

@NgModule({
    imports: [
        // pass the handleUndo in the metaReducers
        StoreModule.provideStore(rootReducer, metaReducers: [handleUndo]) 
    ]
})
export class AppModule { }
```

To undo an action, simply use the `undo` action creator.

```typescript
import {undo} from "ngrx-undo";

// create an action
let action = {type: REMOVE_WINE, payload: {id: wine.id}};

// dispatch it
this.store.dispatch(action);

// undo the action
this.store.dispatch(undo(action));
```

A more concrete example could look like this:

```typescript
import {undo} from "ngrx-undo";

remove(wine: Wine): void {
    // create an action
    let action = {type: REMOVE_WINE, payload: {id: wine.id}};
    // dispatch the action to the store
    this.store.dispatch(action);
    // call the backend
    this.http.delete(`${API_URL}/wines/${wine.id}`)
        .subscribe(
            // on success, do nothing
            () => {},
            // on error, rollback the action
            () => {
                this.store.dispatch(undo(action)); // this is important!
                // maybe show somekind of errormessage to show the user that it's action failed
            }
        );
}
```