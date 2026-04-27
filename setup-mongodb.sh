#!/bin/bash
# MongoDB Setup Script for Sakhi Women Safety Project

echo "=========================================="
echo "Sakhi MongoDB Setup Script"
echo "=========================================="

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first:"
    echo "   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/"
    echo "   - Mac: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/"
    echo "   - Linux: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/"
    exit 1
fi

echo "✅ MongoDB is installed"

# Create data directory if it doesn't exist
if [ ! -d "$HOME/mongodb_data" ]; then
    mkdir -p "$HOME/mongodb_data"
    echo "✅ Created MongoDB data directory"
fi

# Start MongoDB
echo "Starting MongoDB..."
mongod --dbpath "$HOME/mongodb_data" --logpath "$HOME/mongodb_data/mongodb.log" &

sleep 2

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running on localhost:27017"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

echo ""
echo "=========================================="
echo "MongoDB Setup Complete!"
echo "=========================================="
echo ""
echo "Database: sakhi_db"
echo "Host: localhost"
echo "Port: 27017"
echo ""
echo "To connect to the database, use:"
echo "  mongosh mongodb://localhost:27017/sakhi_db"
echo ""
