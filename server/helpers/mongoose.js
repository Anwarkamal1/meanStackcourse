module.exports = {
  normalizeErrors: errors => {
    let normalizeErrors = [];
    for (const property in errors) {
      if (errors.hasOwnProperty(property)) {
        let message = errors[property].message.substr(4);
        normalizeErrors.push({
          title: property,
          detail: message
        });
      }
    }
    return normalizeErrors;
  }
};
