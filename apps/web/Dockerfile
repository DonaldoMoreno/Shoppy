FROM node:20-alpine
WORKDIR /workspace/apps/web
COPY package.json pnpm-lock.yaml* ./
RUN npm i -g pnpm@8
RUN pnpm install --frozen-lockfile --prod
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
