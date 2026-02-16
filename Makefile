.PHONY: dev up down seed test lint

up:
	docker-compose up -d postgres redis minio

down:
	docker-compose down --volumes

dev: up
	# Install & run both apps in dev mode (requires pnpm)
	pnpm --filter @shoppy/api dev &
	pnpm --filter @shoppy/web dev

seed:
	pnpm --filter @shoppy/api -- prisma db push --accept-data-loss && pnpm --filter @shoppy/api -- ts-node -r tsconfig-paths/register prisma/seed.ts

lint:
	pnpm -w lint

test:
	pnpm --filter @shoppy/api test
