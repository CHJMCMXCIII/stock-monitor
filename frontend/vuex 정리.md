# Vuex 구조 (Core Concept)
- https://velog.io/@yjyoo/vue.js-Vuex-%EC%A0%95%EB%A6%AC

### state
- Vue의 data와 같다.
- View와 직접적으로 연결되어있는 Model
- state는 mutation을 통해서만 변경 가능
    - mutation을 통해 state가 변경되면 반응적으로 View가 업데이트 됨

### mutations
- state를 변경하는 유일한 방법
- 일반적으로 **commit**을 통해서만 호출할 수 있다.
    - Helper 함수로 직접 호출할 수도 있다
- 첫 번째 인자는 state, 두 번째 인자는 payload
- 주로 API를 통해 전달받은 데이터를 mutations에서 가공하여 state를 설정하는 데 사용된다.

``` js
store.commit({
  type: 'increment',
  amount: 10
})
/* ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽ */
// store.js
state: {
    count: 0
},
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

### actions
- 비동기 작업이 가능
    - 그 외에는 mutations과 비슷함
- mutation을 호출하기 위한 commit을 사용할 수 있다.
    - action에서도 mutation을 통해 state를 변경 가능함
- **dispatch**를 통해 호출할 수 있다.
- 첫 번째 인자는 context, 두번째 인자는 payload
    - context = state, commit, dispatch 속성들을 포함한다.

``` js
store.dispatch('incrementAsync', {
  amount: 10
})
// or
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
/* ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽  ▽ */
// store.js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```
- axio를 통한 api 호출과 그 결과에 대해 return을 하거나
- mutation으로 commit하는 용도로 사용

### getters
- Vue의 computed와 같음 (계산된 속성)
    - computed = 복잡한 javascript 표현식(데이터 연산) 이 들어감
        - 캐싱 효과가 필요하다면 computed를 사용하고 캐싱이 필요없다면 methods를 사용하도록 하자.
    - watch 속성은 데이터 변화를 감지하여 자동으로 특정 로직을 수행한다.
        - computed 속성과 유사하지만 computed는 내장 api를 사용하는 간단한 연산정도에 적합
        - watch는 데이터 호출과 같이 시간이 상대적으로 더 많이 소모되는 비동기 처리에 적합하다.

- getter의 결과는 종속성에 따라 캐시 되고 변경된 경우에만 다시 계산
- state에 대해 연산을 하고 그 결과를 view에 바인딩 할 수 있음
- state의 변경 여부에 따라 다시 계산하고 view를 업데이트


### 실행 순서
1. Vue Component에서 'dispatch([actions method name])'을 통해 action을 실행
    - 버튼 클릭 등 이벤트 발생
2. actions 에서는 외부 api를 호출하는 등 비동기 로직을 처리
3. 비동기 결과를 'commit([mutaions method name])'을 통해 mutations를 실행
4. mutation에서 state를 변경
5. getters를 이용하여 다시 Vue Component에 바인딩 되어 화면을 갱신