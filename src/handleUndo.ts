import { Action, ActionReducer } from '@ngrx/store';
import { UNDO_ACTION } from './undoAction';


let bufferSize = 100;
export function configureBufferSize(size: number): void {
    bufferSize = size;
}
export function handleUndo(rootReducer: ActionReducer<any>): ActionReducer<any> {
    let executedActions: Array<Action> = [];
    let initialState = '__NO_INITIAL_STATE__';
    return (state: any, action: any) => {
        if (initialState === '__NO_INITIAL_STATE__') {
            initialState = state;
        }

        if (action.type === UNDO_ACTION) {
            // if the action is UNDO_ACTION,
            // then call all the actions again on the rootReducer,
            // except the one we want to rollback
            executedActions = executedActions.filter(eAct => eAct !== action.payload);
            // update the state for every action until we get the
            // exact same state as before, but without the action we want to rollback
            return executedActions.reduce((newState, executedAction) =>
                rootReducer(newState, executedAction), initialState);
        }
        // push every action that isn't an UNDO_ACTION to the executedActions property
        executedActions.push(action);
        const updatedState = rootReducer(state, action);
        if (executedActions.length === bufferSize + 1) {
            const firstAction = executedActions[0];
            // calculate the state x (buffersize) actions ago
            initialState = rootReducer(initialState, firstAction);
            // keep the correct actions
            executedActions = executedActions.slice(1, bufferSize + 1);
        }
        return updatedState;
    };
}
