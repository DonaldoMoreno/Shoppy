FROM node:20-alpine
WORKDIR /workspace/apps/api
COPY package.json pnpm-lock.yaml* ./
RUN npm i -g pnpm@8
RUN pnpm install --frozen-lockfile --prod
COPY . .
RUN pnpm build
EXPOSE 3001
CMD ["node", "dist/main.js"]
