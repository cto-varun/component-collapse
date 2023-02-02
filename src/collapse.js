import React, { useState } from 'react';
import { Collapse as AntdCollapse, Space, Alert } from 'antd';
import * as Icons from '@ant-design/icons';
import './styles.css';
import { useLocation, useHistory } from 'react-router-dom';
import BreadCrumb from '@ivoyant/component-breadcrumb';
import plugin from 'js-plugin';

const { Panel } = AntdCollapse;

export default function Collapse(props) {
    const {
        breadcrumbs,
        title,
        active,
        panels,
        accordion = false,
        expandIconPosition = 'left',
        expandIcons = ['CaretDownOutlined', 'CaretUpOutlined'],
    } = props.component.params;
    const history = useHistory();
    const { pathname, hash, search } = useLocation();
    const { children } = props;
    const { childComponents } = props.component;
    const [activePanelKeys, setActivePanelKeys] = useState(
        (hash && hash.split(/[#?]/)[1]) || []
    );

    const getChildren = (tabIndex) => {
        const childrenOfCollapse = [];
        childComponents.forEach((childComponent, index) => {
            if (Number(childComponent.tabIndex) === tabIndex) {
                childrenOfCollapse.push(
                    React.cloneElement(children[index], {
                        parentProps: props,
                    })
                );
            }
        });
        return childrenOfCollapse;
    };
    const ExpandIcon = Icons[expandIcons[0]];
    const CollapseIcon = Icons[expandIcons[1]];

    const getHeader = (panel, k) => {
        const headerChildren = [];
        const Icon = Icons[panel.icon];
        headerChildren.push(
            <Space size={20}>
                {panel.icon ? (
                    <Icon
                        {...(activePanelKeys === k
                            ? { className: 'collapse__panel-icon--active' }
                            : {})}
                    />
                ) : null}
                <div>
                    <div>
                        <span level={5}>{panel.title}</span>
                    </div>
                    <div className="collapse__panel-subtitle">
                        {panel.subTitle}
                    </div>
                </div>
            </Space>
        );

        return headerChildren;
    };

    const getFeatureData = (featureFlagKey) => {
        const featureFlag = plugin.invoke('features.evaluate', featureFlagKey);
        return featureFlag[0];
    };

    const getPanels = () => {
        return panels.map((panel, index) => {
            const key =
                panel &&
                panel.title &&
                panel.title.toLowerCase().replace(/\s/g, '').replace('/', '-');

            const featureFlag =
                panel.featureFlagKey && getFeatureData(panel.featureFlagKey);
            const disabled = featureFlag && !featureFlag?.enabled;
            return (
                <Panel
                    header={
                        panel instanceof Object ? (
                            <span>{getHeader(panel, key)}</span>
                        ) : (
                            panel
                        )
                    }
                    key={key}
                >
                    {disabled ? (
                        <Alert
                            message={`${panel.title} is disabled ${
                                featureFlag?.reasons?.length > 0
                                    ? `due to ${featureFlag?.reasons.toString()}`
                                    : ''
                            }`}
                            type="info"
                            showIcon
                        />
                    ) : (
                        getChildren(index + 1)
                    )}
                </Panel>
            );
        });
    };

    const callback = (key) => {
        setActivePanelKeys(key);
        if (key) {
            const urlAfterHash = hash && hash.split('?')[1];
            const url = urlAfterHash
                ? `${pathname}#${key}?${urlAfterHash}`
                : search
                ? `${pathname}#${key}${search}`
                : `${pathname}#${key}`;
            history.push(url);
        }
    };

    return (
        <>
            <BreadCrumb title={title} breadcrumbs={breadcrumbs} />
            <AntdCollapse
                defaultActiveKey={activePanelKeys || active}
                accordion={accordion}
                expandIconPosition={expandIconPosition}
                expandIcon={({ isActive }) =>
                    isActive ? <ExpandIcon /> : <CollapseIcon />
                }
                onChange={callback}
                className="component__collapse"
            >
                {getPanels()}
            </AntdCollapse>
        </>
    );
}
