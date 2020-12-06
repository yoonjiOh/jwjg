This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
1. db 변경이나, graphQL 코드 변경 없을 경우
npm run dev
2. 있을 경우
npm run generate
# or
yarn dev
```

localhost:3000 -> client
localhost:3000/api -> graphQL API playground

## 기타 명령어

```
npx prisam2 introspect -> npx prisma2 generate // db 에서 변경 사항이 있을 경우, 이를 모델링으로 instropect 해준다
결과는 prisma/schema.prisma 에서 확인 가능
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
