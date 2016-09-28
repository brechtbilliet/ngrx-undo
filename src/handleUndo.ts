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
            executedActions = executedActions.filter(eAct => eAct !== action.payload);
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