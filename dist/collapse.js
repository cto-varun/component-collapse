"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Collapse;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var Icons = _interopRequireWildcard(require("@ant-design/icons"));
require("./styles.css");
var _reactRouterDom = require("react-router-dom");
var _componentBreadcrumb = _interopRequireDefault(require("@ivoyant/component-breadcrumb"));
var _jsPlugin = _interopRequireDefault(require("js-plugin"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const {
  Panel
} = _antd.Collapse;
function Collapse(props) {
  const {
    breadcrumbs,
    title,
    active,
    panels,
    accordion = false,
    expandIconPosition = 'left',
    expandIcons = ['CaretDownOutlined', 'CaretUpOutlined']
  } = props.component.params;
  const history = (0, _reactRouterDom.useHistory)();
  const {
    pathname,
    hash,
    search
  } = (0, _reactRouterDom.useLocation)();
  const {
    children
  } = props;
  const {
    childComponents
  } = props.component;
  const [activePanelKeys, setActivePanelKeys] = (0, _react.useState)(hash && hash.split(/[#?]/)[1] || []);
  const getChildren = tabIndex => {
    const childrenOfCollapse = [];
    childComponents.forEach((childComponent, index) => {
      if (Number(childComponent.tabIndex) === tabIndex) {
        childrenOfCollapse.push( /*#__PURE__*/_react.default.cloneElement(children[index], {
          parentProps: props
        }));
      }
    });
    return childrenOfCollapse;
  };
  const ExpandIcon = Icons[expandIcons[0]];
  const CollapseIcon = Icons[expandIcons[1]];
  const getHeader = (panel, k) => {
    const headerChildren = [];
    const Icon = Icons[panel.icon];
    headerChildren.push( /*#__PURE__*/_react.default.createElement(_antd.Space, {
      size: 20
    }, panel.icon ? /*#__PURE__*/_react.default.createElement(Icon, activePanelKeys === k ? {
      className: 'collapse__panel-icon--active'
    } : {}) : null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("span", {
      level: 5
    }, panel.title)), /*#__PURE__*/_react.default.createElement("div", {
      className: "collapse__panel-subtitle"
    }, panel.subTitle))));
    return headerChildren;
  };
  const getFeatureData = featureFlagKey => {
    const featureFlag = _jsPlugin.default.invoke('features.evaluate', featureFlagKey);
    return featureFlag[0];
  };
  const getPanels = () => {
    return panels.map((panel, index) => {
      const key = panel && panel.title && panel.title.toLowerCase().replace(/\s/g, '').replace('/', '-');
      const featureFlag = panel.featureFlagKey && getFeatureData(panel.featureFlagKey);
      const disabled = featureFlag && !featureFlag?.enabled;
      return /*#__PURE__*/_react.default.createElement(Panel, {
        header: panel instanceof Object ? /*#__PURE__*/_react.default.createElement("span", null, getHeader(panel, key)) : panel,
        key: key
      }, disabled ? /*#__PURE__*/_react.default.createElement(_antd.Alert, {
        message: `${panel.title} is disabled ${featureFlag?.reasons?.length > 0 ? `due to ${featureFlag?.reasons.toString()}` : ''}`,
        type: "info",
        showIcon: true
      }) : getChildren(index + 1));
    });
  };
  const callback = key => {
    setActivePanelKeys(key);
    if (key) {
      const urlAfterHash = hash && hash.split('?')[1];
      const url = urlAfterHash ? `${pathname}#${key}?${urlAfterHash}` : search ? `${pathname}#${key}${search}` : `${pathname}#${key}`;
      history.push(url);
    }
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_componentBreadcrumb.default, {
    title: title,
    breadcrumbs: breadcrumbs
  }), /*#__PURE__*/_react.default.createElement(_antd.Collapse, {
    defaultActiveKey: activePanelKeys || active,
    accordion: accordion,
    expandIconPosition: expandIconPosition,
    expandIcon: _ref => {
      let {
        isActive
      } = _ref;
      return isActive ? /*#__PURE__*/_react.default.createElement(ExpandIcon, null) : /*#__PURE__*/_react.default.createElement(CollapseIcon, null);
    },
    onChange: callback,
    className: "component__collapse"
  }, getPanels()));
}
module.exports = exports.default;