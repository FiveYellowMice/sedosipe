function requireArgument(arg, errorMessage, qualifierFunction = (a => a)) {
  if (qualifierFunction(arg)) {
    return arg;
  } else {
    if (!errorMessage) {
      errorMessage = 'an argument';
    }
    if (!errorMessage.includes(' ')) {
      errorMessage = `${errorMessage} is required but not given`;
    }
    throw new ArgumentError(errorMessage);
  }
}

module.exports = requireArgument;
