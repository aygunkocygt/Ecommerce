FROM node:20-alpine AS deps

COPY package*.json ./

RUN npm ci

FROM node:20-alpine AS builder

COPY . .
COPY --from=deps /node_modules ./node_modules
COPY ./.env ./.env
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

COPY --from=builder /next.config.mjs ./
COPY --from=builder /public ./public
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /.next ./.next
COPY --from=builder /prisma ./prisma
COPY --from=builder /.env ./.env

EXPOSE 3000



CMD ["node_modules/.bin/next", "start"]


