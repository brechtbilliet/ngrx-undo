import {Reducer, Dispatcher} from "@ngrx/store";
import {handleUndo} from "./handleUndo";
export function createReducer(dispatcher: Dispatcher, reducer, options: {bufferSize: 100}) {
    return new Reducer(dispatcher, handleUndo(reducer, options.bufferSize));
}
