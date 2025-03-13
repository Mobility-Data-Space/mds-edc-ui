This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, make sure you have your **.envrc** file filled like the example provided in **.envrc.example**, you can find example values exported as **DATASPACE** from **src/constants/dataspace.ts**

**package.json** has private repositories listed as dependencies and will require the presence of an **.npmrc** file, follow the example in **.npmrc.example**

Run the development server:

```bash
docker compose up
```

```bash
yarn seed
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
