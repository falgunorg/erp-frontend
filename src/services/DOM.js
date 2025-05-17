export default class DOM {
  static isDescendant(el, targetParent) {
    let isChild = false;
    try {
      if (el === targetParent) {
        //is this the element itself?
        isChild = true;
      }

      while ((el = el.parentNode)) {
        if (el == targetParent) {
          isChild = true;
        }
      }
    } catch (ex) {}

    return isChild;
  }
}
