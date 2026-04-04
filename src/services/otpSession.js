// Holds the OTP confirmation result in memory (not serializable, can't go in router state)
let _confirmation = null;

export const setConfirmation = (c) => { _confirmation = c; };
export const getConfirmation = () => _confirmation;
export const clearConfirmation = () => { _confirmation = null; };
