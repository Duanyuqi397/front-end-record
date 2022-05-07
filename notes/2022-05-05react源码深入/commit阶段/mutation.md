## mutation阶段
主要工作是执行dom操作，遍历effectList，调用commitMutationEffects，根据effectTag调用不同的函数处理fiber
### commitMutationEffects
遍历effectList，对每个fiber节点执行以下三个操作：
    根据ContentReset effectTag重置文本节点，
    更新ref，
    根据effectTag(Placement|Update|Deletion|Hydrating)分别处理
#### Placement
获取父级dom节点
获取fiber节点的兄弟节点
根据dom兄弟节点是否存在决定调用parentNode.insertBefore或parentNode.appendChild执行DOM插入操作
** 由于fiber树和渲染dom树不是一一对应的，所以要从fiber节点找到dom节点很可能会跨层级遍历

#### Update
当fiber节点含有Update effect，意味着他需要更新，调用的方法为commitWork，他会根据effect.tag不同，执行不同操作
这里主要关注FunctionComponent和HostComponent
FunctionComponent
    遍历effectList，执行所有useLayoutEffect的销毁函数
HostComponent
    调用commitUpdate，最终会在updateDOMProperties中将render阶段completeWork中为Fiber节点赋值的updateQueue对应的内容渲染在页面上
```JavaScript
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // 处理 style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
  // 处理 DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
  // 处理 children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
  // 处理剩余 props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```
Deletion
    调用commitDeletion：
    递归调用fiber及其子孙节点中fiber.tag为classComponent的componentWillUnmount生命周期钩子，页面移除fiber节点对应的dom节点
    解绑ref
    调用useEffect的销毁函数