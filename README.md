# learn-gulp

빌드 자동화 툴킷 Gulp.js 사용하기

## Use Gulp
정말 간단하다. 자동화가 필요한 부분을 역할에 맞게 나눠서 "파이프"를 연결하고, "시리즈"로 묶어주면 된다.

### 자동화 분배하기
pug, scss, 이미지 파일, 자바스크립트 파일을 다뤘다. 일반적으로 Gulp 없이는 하나하나 코드를 줄이던지, 이미지를 압축하던지, 렌더링 템플릿을 변환하던지 따로 작업해야 한다. 각각의 작업에 필요한 일련의 과정을 `src`, `pipe`, `dest`를 이용하여 묶는다.


### 작업 만들기

#### ✔️ src, pipe, dest

기본적인 로직은 다음과 같다.

```js
const operation = () => gulp.src(파일의 위치)
                            .pipe(작업 수행)
                            .dest(작업 수행 후 파일의 위치)
```

pug면 pug에 맞게, js면 js에 맞게 각각을 이러한 패턴으로 디자인할 수 있다. 직접 구현할 작업은 없을 정도로 gulp에 대한 플러그인이 잘 되어있다.

#### ✔️ series

각각의 작업은 다음과 같이 시리즈로 묶는다.

```js
const prepare = gulp.series([operation1, operation2]);
export const dev = gulp.series([prepare, operation3]);
```

export시 변수 이름 그대로 `gulp 변수이름`으로 시리즈의 작업을 수행할 수 있다. 위처럼 선언해놓은 시리즈를 시리즈 안에 삽입하는 것도 가능하다. 작업을 동시에 처리하고 싶다면 `series` 대신 `parallel`을 사용하면 된다.

#### ✔️ watch

작업 중 파일이 변경되었을 때의 작업도 설정할 수 있다.

```js
const watch = () => {
    gulp.watch("인식할 파일(와일드카드 가능)", 수행할 작업)
}
```

이 `watch` 변수도 똑같이 필요한 부분의 시리즈에 같이 묶어주면 된다.

### gulp plugins

거의 자동화할 모든 작업들은 플러그인이 만들어져 있다. npm, yarn으로 플러그인 설치 시 `--dev` 또는 `-D`를 옵션에 추가하여 개발환경 의존성에 추가한다.

이번에 사용한 플러그인은 다음과 같다.
- gulp-pug
  - pug 파일을 html 파일로 변환, 인덴트 압축
- del
  - 파일, 디렉토리 삭제
- gulp-webserver
  - 간단한 테스트용 개발 서버 열기
- gulp-image
  - 이미지 압축 -> 압축에는 시간이 다소 소요되기 때문에 watch 작업에 포함할 때는 신중하게 결정해야 한다.
- gulp-sass
  - scss 파일을 css 파일로 변환
- gulp-autoprefixer
  - css 파일을 브라우저 호환 옵션에 맞게 확장
- gulp-csso
  - css 파일 코드 압축
- gulp-bro (babelify, uglifyify)
  - 간편하게 Babel로 호환성 변환, 코드 압축
- gulp-gh-pages
  - Github Page 배포