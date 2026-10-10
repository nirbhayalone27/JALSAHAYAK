.PHONY: help setup up down logs backend-dev frontend-dev migrate test seed lint clean

help:
	@echo "JalSahayak Development Commands:"
	@echo "  make setup        - Initialize environment file (.env)"
	@echo "  make up           - Start infrastructure with Docker Compose (PostGIS, Redis, MinIO)"
	@echo "  make down         - Stop Docker Compose services"
	@echo "  make logs         - Stream docker-compose logs"
	@echo "  make migrate      - Run Alembic migrations up to head"
	@echo "  make seed         - Seed deterministic synthetic demo data"
	@echo "  make test         - Run backend test suite"
	@echo "  make backend-dev  - Start local FastAPI dev server"
	@echo "  make frontend-dev - Start local Vite dev server"
	@echo "  make clean        - Remove caches and temporary files"

setup:
	cp -n .env.example .env || true
	@echo "Environment file created (.env)"

up:
	docker compose up -d postgres redis minio

down:
	docker compose down

logs:
	docker compose logs -f

migrate:
	cd backend && alembic upgrade head

seed:
	python3 scripts/seed_synthetic_data.py

test:
	cd backend && pytest -v tests/

backend-dev:
	cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

frontend-dev:
	cd frontend && npm run dev

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "*.egg-info" -exec rm -rf {} +
