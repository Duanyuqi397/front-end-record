https://github.com/Duanyuqi397/mock-zhihu-master/tree/master

1.仿知乎首页，练习flex布局
2.使用tailwindcss写样式，规避命名带来的问题
3.实现tab页接触滚动效果，实现思路：
    通过 IntersectionObserver 监听元素可见性变化，触发回调
    外层组件控制是否切换的标志hide
    navigation通过标志判断动画，实现切换