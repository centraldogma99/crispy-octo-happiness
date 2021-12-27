# Quiz app
퀴즈 어플리케이션 입니다.
## src/components
### frame
최상위 컴포넌트, `Intro` 와 `QuizFrame`을 렌더링 한다.  

### intro
초기 화면(난이도 선택 화면).  

### quiz
퀴즈 컴포넌트, `QuizFrame`에 의해 퀴즈를 prop으로 받아 렌더링된다.  

### result
결과 창 컴포넌트, 통계(정답/오답/걸린 시간)와 다시 풀기/정답 보기/새로운 문제 풀기/첫 화면으로 가기 기능을 지원한다.  

### styled
styled component들이 저장되어 있다.

## src/contexts
- 컨텍스트들이 정의되어 있다.  
### ContentContext
화면에 표시하는 컨텐츠가 무엇인지?(Intro, Quiz)  

## src/modules
- 여러 컴포넌트에서 활용되는 함수들이 정의되어 있다.  

## src/types
- type들이 정의되어 있다.  
  