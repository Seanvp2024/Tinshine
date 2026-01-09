# TinShine Packaging Website

A complete React + TypeScript + Tailwind CSS website with Node.js backend for managing tin packaging products and blog content.

## Features

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + JSON file storage
- **Data Management**: Complete CRUD operations for products and blogs
- **Admin Dashboard**: Manage products and blog content with real-time server synchronization
- **Responsive Design**: Mobile-friendly layout
- **Dark Mode Support**: User preference for dark/light theme
- **Animation**: Smooth animations with Framer Motion
- **Deployment Ready**: Complete deployment guide for Ubuntu server

## Local Development

### Prerequisites
- Node.js 20 or higher
- pnpm package manager

### Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start both frontend and backend servers:
```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Backend API

The backend provides the following API endpoints:
- `GET /api/version` - Get current data version
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Add a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a specific blog
- `POST /api/blogs` - Add a new blog
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog
- `GET /api/sync/all` - Get all data for synchronization

### Admin Access

To access the admin dashboard:
- URL: http://localhost:3000/admin/login
- Default credentials:
  - Username: `admin`
  - Password: `password123`

## Deployment

For detailed deployment instructions, please refer to the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) file.