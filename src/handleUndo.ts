import {ActionReducer, Action} from "@ngrx/store";
import {UNDO_ACTION} from "./storeUndo";
export function handleUndo(rootReducer: ActionReducer<any>,
                              bufferSize): ActionReducer<any> {
    let executedActions: Array<Action> = [];
    let initialState = undefined;
    return (state: any, action: Action) => {
        if (action.type === UNDO_ACTION) {
            // if the action is UNDO_ACTION,
            // then call all the actions again on the rootReducer,
            // except the one we want to rollback
            let newState: any = initialState;
            executedActions = executedActions.filter(eAct => {
                if (eAct.type !== action.payload.type) return true;
                return !objectEquals(eAct, action.payload);
            });
            // update the state for every action untill we get the
            // exact same state as before, but without the action we want to rollback
            executedActions.forEach(executedAction =>
                newState = rootReducer(newState, executedAction));
            return newState;
        }
        // push every action that isn't an UNDO_ACTION to the executedActions property
        executedActions.push(action);
        let updatedState = rootReducer(state, action);
        if (executedActions.length === bufferSize + 1) {
            let firstAction = executedActions[0];
            // calculate the state x (buffersize) actions ago
            initialState = rootReducer(initialState, firstAction);
            // keep the correct actions
            executedActions = executedActions.slice(1, bufferSize + 1);
        }
        return updatedState;
    };
}
function objectEquals(x, y) {
  'use strict';

  if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
  // after this just checking type of one would be enough
  if (x.constructor !== y.constructor) { return false; }
  // if they are functions, they should exactly refer to same one (because of closures)
  if (x instanceof Function) { return x === y; }
  // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
  if (x instanceof RegExp) { return x === y; }
  if (x === y || x.valueOf() === y.valueOf()) { return true; }
  if (Array.isArray(x) && x.length !== y.length) { return false; }

  // if they are dates, they must had equal valueOf
  if (x instanceof Date) { return false; }

  // if they are strictly equal, they both need to be object at least
  if (!(x instanceof Object)) { return false; }
  if (!(y instanceof Object)) { return false; }

  // recursive object equality check
  var p = Object.keys(x);
  return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
    p.every(function (i) { return objectEquals(x[i], y[i]); });
}
