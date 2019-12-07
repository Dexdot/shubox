export default (str, maxlen) =>
  str.length > maxlen && `${str.substr(0, maxlen)}...`;
