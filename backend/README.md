# Digital Store Backend

A Node.js backend for a digital store built with Express.js and MongoDB.

## Features

- User authentication and authorization
- Product management
- Order processing
- Payment integration with Stripe
- Image upload with Cloudinary
- Caching with Redis
- Email notifications
- Loyalty points system
- Multi-language support

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Start the server: `npm start`

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/profile
- PUT /api/auth/profile

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

### Orders
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders
- PUT /api/orders/:id
- DELETE /api/orders/:id

### Reviews
- GET /api/reviews/product/:productId
- POST /api/reviews
- PUT /api/reviews/:id
- DELETE /api/reviews/:id

### Wishlist
- GET /api/wishlist
- POST /api/wishlist
- DELETE /api/wishlist/:productId

### Coupons
- GET /api/coupons
- POST /api/coupons
- PUT /api/coupons/:id
- DELETE /api/coupons/:id

### Upload
- POST /api/upload

### Admin
- GET /api/admin/users
- GET /api/admin/orders
- GET /api/admin/products

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Stripe
- Cloudinary
- Redis
- Nodemailer
- Joi
- Sharp
- Slugify
