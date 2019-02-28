import { selectRoot } from "../root/selectors";

export const selectSubmission = (name, state) => selectRoot(name, state).submission;
