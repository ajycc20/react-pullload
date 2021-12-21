/**
 * react-pullload v1.0.0
 * (c) 2021 ajycc20 <ajycc20@qq.com>
 * Released under the MIT License.
 */
import React from 'react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".pull-load-content{background:#000;height:300px;width:300px}";
styleInject(css_248z);

var PullLoad = function PullLoad() {
  return /*#__PURE__*/React.createElement("div", {
    className: "pull-load-content"
  }, "111");
};

export { PullLoad };
