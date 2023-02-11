FROM node:19-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:19-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM node:19-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 qr-group
RUN adduser --system --uid 1001 qr-user
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=qr-user:qr-group /app/.next/standalone ./
COPY --from=builder --chown=qr-user:qr-group /app/.next/static ./.next/static
USER qr-user
EXPOSE 3000

CMD ["node", "server.js"]