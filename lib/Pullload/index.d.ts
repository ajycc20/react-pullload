import React from 'react';
import './index.scss';
interface IProps {
    listData: any[];
    hasMore: boolean;
    children: any;
    className?: string;
    onPullUp?: Function;
    onPullDown?: Function;
}
/**
 * @description 下拉刷新 - 上拉加载
 * @param props
 * @returns {JSX.Element}
 */
declare const PullLoad: React.ForwardRefExoticComponent<IProps & React.RefAttributes<any>>;
export default PullLoad;
