/**
 * Helper function to create an error from a message or Error object
 * @param messageOrError - The error message or Error object
 * @param defaultMessage - The default message to use if messageOrError is not provided
 * @returns An Error object
 */
export function createError(messageOrError: string | Error | undefined, defaultMessage: string): Error {
  return messageOrError instanceof Error ? messageOrError : new Error(messageOrError ?? defaultMessage);
}
