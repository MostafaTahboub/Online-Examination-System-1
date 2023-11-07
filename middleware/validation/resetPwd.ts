let ableToReset = (one: string, two: string) => {
  if (one.length !== two.length) {
    return false;
  } else {
    if (one.length < 6) {
      return false;
    }
    for (let i = 0; i < one.length; i++) {
      if (one[i] !== two[i]) {
        return false;
      }
    }
    return true;
  }
};
export default ableToReset;
