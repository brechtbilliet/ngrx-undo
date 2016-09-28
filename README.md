# ngrx-store
This package contains undo functionality for [@ngrx/store](https://github.com/ngrx/store). 
The goal of this package is described in this blogpost [Cancellable optimistic updates in angular2 and redux](http://blog.brecht.io/Cancellable-optimistic-updates-in-Angular2-and-Redux/) written by [Brecht Billiet](http://brecht.io)

## Installation
`npm install ngrx-undo --save`

## Usage
To use ngrx-undo, you will need to setup the provders using 
`interceptStore({bufferSize: 100})`

```typescript 
import {StoreUndoModule} from 'ngrx-undo';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    // Note that you must intercept after importing StoreModule
    StoreUndoModule.interceptStore({
      bufferSize: 100 // to determine the size of the buffer (optional)
    })
  ]
  ///
})
export class AppModule...
```

To undo an action simply do the following:

```typescript
import {UNDO_ACTION} from "ngrx-undo";

// create an action
let action = {type: REMOVE_WINE, payload: {_id: wine._id}};
// dispatch it
this.store.dispatch(action);
	
// undo the action
this.store.dispatch({type: UNDO_ACTION, payload: action; // this is important!
  
```

A more concrete example could be this:

```typescript
import {UNDO_ACTION} from "ngrx-undo";

remove(wine: Wine): void {
	// create an action
	let action = {type: REMOVE_WINE, payload: {_id: wine._id}};
	//dispatch the action to the store
	this.store.dispatch(action);
	// call the backend
    this.http.delete(`${API_URL}/wines/${wine._id}`)
    	.subscribe(
    		// on success, do nothing
    		() => {}, 
	    	// on error, rollback the action
	    	() => {
	    		this.store.dispatch({type: UNDO_ACTION, payload: action}); // this is important!
	    	// maybe show somekind of errormessage to show the user that it's action failed
    	});
}
```

### What if you are using @ngrx/store-devtools

Just make sure your import is the last :-)

```typescript
@NgModule({
	imports: [
	    StoreModule.provideStore(rootReducer), StoreDevtoolsModule.instrumentStore({
	        monitor: useLogMonitor({
	            visible: false,
	            position: "right"
	        })
	    }), StoreUndoModule.interceptStore({bufferSize: 100}), ...
	],
	...
})
export class AppModule...
```