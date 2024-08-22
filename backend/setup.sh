#!/bin/bash

# サーバーPIDファイルが存在する場合、削除
if [ -f tmp/pids/server.pid ]; then
  echo "Removing old server PID file..."
  rm -rf tmp/pids/server.pid
fi

echo "Creating the database..."
docker compose run web bash -c "rails db:create"

# Dockerコンテナのビルドと起動
echo "Building and starting Docker containers..."
docker compose up --build -d

echo "Setup complete!"
