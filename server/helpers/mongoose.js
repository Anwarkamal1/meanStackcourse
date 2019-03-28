module.exports = {
  normalizeErrors: errors => {
    let normalizeErrors = [];
    for (const property in errors) {
      if (errors.hasOwnProperty(property)) {
        let message = '';
        if (errors[property].message.includes('Path')) {
          message = errors[property].message.substr(4);
        } else {
          message = errors[property].message;
        }
        normalizeErrors.push({
          title: property,
          detail: message
        });
      }
    }
    return normalizeErrors;
  }
};
