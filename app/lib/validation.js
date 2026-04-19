//implementing regex validation for user data inputs
export const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
export const addressRegex = /^[A-Za-z0-9\s,.-]{5,150}$/;
export const mobileRegex = /^(\+353|0)(8[3-9])\d{7}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const eircodeRegex = /^[A-Z0-9]{3}\s[A-Z0-9]{4}$/;

//implementing regex validation for appliance data inputs
export const applianceTypeRegex = /^[A-Za-z\s]{2,50}$/;
export const brandRegex = /^[A-Za-z0-9\s\-&.]{1,50}$/;
export const modelNumberRegex = /^[A-Za-z0-9\-_/.\s]{1,50}$/;
export const serialNumberRegex = /^[A-Za-z0-9\-_]{3,50}$/;
export const costRegex = /^\d{1,7}(\.\d{1,2})?$/;