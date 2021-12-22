import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, Ref } from 'react';

import BScroll from '@better-scroll/core';
import ObserveDOM from '@better-scroll/observe-dom';
import ObserveImage from '@better-scroll/observe-image';
import PullUp from '@better-scroll/pull-up';
import PullDown from '@better-scroll/pull-down';

import './index.scss';

BScroll.use(ObserveDOM);
BScroll.use(ObserveImage);
BScroll.use(PullUp);
BScroll.use(PullDown);

enum ERefreshingText {
  enter = '下拉刷新',
  leave = '松开刷新',
  fetching = '加载中',
  succeed = '加载成功'
}

enum ELoadMoreText {
  loaded = '加载中',
  ended = '没有更多'
}

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
const PullLoad = forwardRef((props: IProps, ref: Ref<any>) => {
  const { listData, hasMore, className, onPullUp, onPullDown, children } = props;

  const [refreshingText, setRefreshingText] = useState<ERefreshingText>(ERefreshingText.enter); // 下拉刷新 松开刷新 加载中 加载成功
  const [loadMoreText, setLoadMoreText] = useState<ELoadMoreText>(ELoadMoreText.loaded); // 加载中 没有更多

  const [scrollObj, setScrollObj] = useState<BScroll>(); // BS 对象
  const wrapRef = useRef<HTMLDivElement>(null); // BS 实例

  useImperativeHandle(ref, () => ({
    scrollObj: scrollObj
  }));

  useEffect(() => {
    setLoadMoreText(hasMore ? ELoadMoreText.loaded : ELoadMoreText.ended);
  }, [hasMore]);

  useEffect(() => {
    setScrollObj(
      new BScroll(wrapRef.current as HTMLDivElement, {
        probetype: 3,
        bounceTime: 200,
        // 原生 click 事件开启，防止在BS实例中无法点击
        click: true,
        // 检测dom变化
        observeDOM: true,
        observeImage: true,
        // 垂直方向滚动
        scrollY: true,
        // 使用过度动画
        useTransition: true,
        // 下拉刷新
        pullDownRefresh: {
          threshold: 70,
          stop: 56
        },
        //  上拉加载更多
        pullUpLoad: {
          threshold: 90,
          stop: 10
        }
      })
    );

    return () => {
      scrollObj?.destroy();
    };
  }, []);

  useEffect(() => {
    //  下拉刷新
    //  每次更新都需要先把之前的pullingDown事件清除，不然会累加
    scrollObj?.off('pullingDown');
    scrollObj?.once('pullingDown', pullDownRefresh);

    scrollObj?.on('enterThreshold', () => {
      setRefreshingText(ERefreshingText.enter);
    });
    scrollObj?.on('leaveThreshold', () => {
      setRefreshingText(ERefreshingText.leave);
    });

    //  上拉加载
    //  每次更新都需要先把之前的pullingUp事件清除，不然会累加
    scrollObj?.off('pullingUp');
    scrollObj?.once('pullingUp', pullUpLoad);
  }, [listData]);

  const pullDownRefresh = async () => {
    setRefreshingText(ERefreshingText.fetching);

    onPullDown && (await onPullDown());

    setRefreshingText(ERefreshingText.succeed);

    // 结束该次 BS 操作
    setTimeout(() => {
      scrollObj?.finishPullDown();
      scrollObj?.refresh();
    }, 100);
  };

  const pullUpLoad = async () => {
    if (!hasMore) {
      return;
    }

    setLoadMoreText(ELoadMoreText.loaded);

    onPullUp && (await onPullUp());

    scrollObj?.finishPullUp();
    scrollObj?.refresh();

    setLoadMoreText(ELoadMoreText.ended);
  };

  return (
    <div
      className={`pull-load-wrapper ${listData.length <= 0 ? 'pull-load-wrapper-visible' : ''} ${className || ''}`}
      ref={wrapRef}
    >
      <div className="pull-load-content">
        {/* pull down loading DOM */}
        {onPullDown ? (
          <div className="pull-load-loading">
            <div className="pull-load-refresh-loading">
              <img src="https://sm.ms/image/nh2ZzwbC3rJ8Voe" />
              <div className="text">{refreshingText}</div>
            </div>
          </div>
        ) : null}

        {/* render list dom */}
        {children}

        {/* pull up loading DOM */}
        {onPullUp ? (
          <div className="pull-load-more">
            <div className="pull-load-refresh-loading">
              {hasMore ? <img src="https://sm.ms/image/nh2ZzwbC3rJ8Voe" /> : null}
              <div className="text">{loadMoreText}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default PullLoad;
