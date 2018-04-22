class ActionUnapplicableError extends Error {

  constructor(subject, message) {
    super(message);
    this.subject = subject;
  }

}

module.exports = ActionUnapplicableError;
