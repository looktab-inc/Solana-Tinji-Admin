# Solana-Tinji-Admin

### **TINJI is NFT Marketing Tool**

**Low cost, High performance with Dynamic NFTs.**

Local businesses can attract local customers by airdropping dNFTs. The ads can reach customers 100% by making them swipe the dNFTs to receive them. This way, local businesses can decrease marketing costs and increase their advertising performance. Additionally, users can earn coupon benefits and tokens by viewing the ads.


Demo https://tinji-admin.vercel.app

## Getting Started
1. run the docker database:
```bash
docker-compose up -d
```

here is database connection profile. (mariadb)
```bash
username : user
passowrd : passowrd
hostname : 127.0.0.1
prot : 33306
```


2. copy .env.example to .env.local
```bash
cp .env.example .env.local
```

3. migrate database table:
```bash
npm run migrate
# or
yarn migrate
```

4. run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

if you want to delete docker container
```bash
docker-compose down -v
```
