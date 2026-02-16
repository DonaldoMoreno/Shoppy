#!/usr/bin/env python3
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env"
ENV_EXAMPLE = ROOT / ".env.example"


def run(cmd, cwd=ROOT, check=True):
    print(f"$ {cmd}")
    return subprocess.run(cmd, cwd=cwd, shell=True, check=check)


def main():
    if not ENV_FILE.exists() and ENV_EXAMPLE.exists():
        print("Creating .env from .env.example")
        ENV_FILE.write_text(ENV_EXAMPLE.read_text())

    run("npm i -g pnpm@8")
    run("pnpm install")
    run("make up")

    # Sync schema and seed demo data
    run("pnpm --filter @shoppy/api exec prisma db push --accept-data-loss")
    run("pnpm --filter @shoppy/api exec ts-node prisma/seed.ts")

    # Start API and web in background
    env = os.environ.copy()
    env.setdefault("JWT_SECRET", "devsecret")

    api_proc = subprocess.Popen(
        "pnpm --filter @shoppy/api dev",
        cwd=str(ROOT),
        shell=True,
        env=env,
    )
    web_proc = subprocess.Popen(
        "pnpm --filter @shoppy/web dev",
        cwd=str(ROOT),
        shell=True,
        env=env,
    )

    print("\nAPI running at http://localhost:3001")
    print("Web running at http://localhost:3000")
    print("Press Ctrl+C to stop.")

    try:
        api_proc.wait()
        web_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping...")
        api_proc.terminate()
        web_proc.terminate()
        api_proc.wait(timeout=10)
        web_proc.wait(timeout=10)


if __name__ == "__main__":
    sys.exit(main())
