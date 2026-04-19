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

//implementing validation for inputs using regex 
export function validateUser(data) {
  if (!nameRegex.test(data.firstName))
    return { valid: false, message: 'Invalid first name.Plaease, enter from 2–50 letters' };
  if (!nameRegex.test(data.lastName))
    return { valid: false, message: 'Invalid last name Plaease, enter from 2–50 letters' };
  if (!addressRegex.test(data.address))
    return { valid: false, message: 'Invalid address. Plaease, enter from 5–150 characters' };
  if (!mobileRegex.test(data.mobile))
    return { valid: false, message: 'Invalid mobile . Plaease, enter input in valid format:08X XXXXXXX' };
  if (!emailRegex.test(data.email))
    return { valid: false, message: 'Invalid email address. Please, enter again' };
  if (!eircodeRegex.test(data.eircode))
    return { valid: false, message: 'Invalid Eircode format .Plaease, enter input in valid format:D00 AB00' };
  return { valid: true };
}

export function validateAppliance(data) {
  if (!applianceTypeRegex.test(data.applianceType))
    return { valid: false, message: 'Invalid appliance type .Please enter letters only' };
  if (!brandRegex.test(data.brand))
    return { valid: false, message: 'Invalid brand name. Please, try again' };
  if (!modelNumberRegex.test(data.modelNumber))
    return { valid: false, message: 'Invalid model number. Plaese, try again' };
  if (!serialNumberRegex.test(data.serialNumber))
    return { valid: false, message: 'Invalid serial number. Please enter in alphanumeric, from 3–50 characters' };
  if (!data.purchaseDate)
    return { valid: false, message: 'Please, enter the purchase date' };
  if (!data.warrantyExpirationDate)
    return { valid: false, message: 'Please, enter warranty expiration date' };
  if (new Date(data.warrantyExpirationDate) <= new Date(data.purchaseDate))
    return { valid: false, message: 'Warranty expiration must be after purchase date' };
  if (!costRegex.test(String(data.cost)))
    return { valid: false, message: 'Invalid cost. Please, enter in format : 000.00' };
  return { valid: true };
}