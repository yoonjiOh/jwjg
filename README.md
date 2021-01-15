Re:pol (가제) SNS Fullstack Repo 입니다.

## Getting Started

클라이언트 개발 환경 띄우는 커맨드

```bash
1. db 변경이나, graphQL 코드 변경 없을 경우
npm run dev
2. 있을 경우
npm run generate
# or
yarn dev
```
데이터 모델 바꾸고 반영하는 커맨드

```
npm run generate
```

localhost:3000 -> client
localhost:3000/api -> graphQL API playground

## 기타 명령어

```
npx prisma2 introspect -> npx prisma2 generate // db 에서 변경 사항이 있을 경우, 이를 모델링으로 instropect 해준다
결과는 prisma/schema.prisma 에서 확인 가능
```
