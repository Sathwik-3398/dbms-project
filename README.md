# Smart Book Exchange & Marketplace System

A full-stack web application for buying, selling, and exchanging books with intelligent valuation, real-time chat, and comprehensive marketplace features.

## 📚 Project Overview

This platform enables users to:
- **Buy books** from verified sellers
- **Sell books** with easy listing management
- **Exchange books** with smart value calculation
- **Chat in real-time** with sellers
- **Get recommendations** based on preferences
- **Track transactions** and order history
- **Rate and review** sellers

## 🛠 Technology Stack

### Frontend
- React 18+
- React Router v6
- TailwindCSS
- Axios
- Socket.io-client
- Formik + Yup
- Stripe React SDK

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- Stripe Payment API
- Cloudinary (Image Storage)

### Database
- MongoDB (Primary Database)
- Redis (Caching - Optional)

## 📁 Project Structure

```
book-marketplace/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # Mongoose models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Input validation
│   │   └── socket/          # Socket.io handlers
│   ├── uploads/             # Temporary file uploads
│   ├── logs/                # Application logs
│   ├── server.js            # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   │   ├── common/      # Shared components
    │   │   ├── seller/      # Seller-specific
    │   │   ├── user/        # User-specific
    │   │   └── admin/       # Admin-specific
    │   ├── pages/           # Page components
    │   │   ├── auth/        # Login, Register
    │   │   ├── seller/      # Seller dashboard
    │   │   ├── user/        # User pages
    │   │   └── admin/       # Admin dashboard
    │   ├── services/        # API services
    │   ├── contexts/        # React contexts
    │   ├── hooks/           # Custom hooks
    │   ├── utils/           # Helper functions
    │   └── assets/          # Static assets
    ├── public/
    ├── .env                 # Environment variables
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Cloudinary account
- Stripe account

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# - MongoDB URI
# - JWT secrets
# - Cloudinary credentials
# - Stripe keys

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with API URL
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Start development server
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📖 Documentation

### Core Documentation
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Complete project overview and features
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Detailed database schema design
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API endpoint documentation
- **[STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md)** - 30-day implementation guide

## 🎯 Key Features

### 1. Dual Portal System

#### Seller Portal
- Register as a seller
- Add/edit/delete book listings
- Upload multiple book images
- Set pricing and listing type (sale/exchange/both)
- View sales analytics
- Manage inventory
- Respond to exchange requests
- Chat with potential buyers

#### User Portal
- Browse all available books
- Advanced search and filters
- View detailed book information
- Three action options per book:
  - **Buy Now** - Direct purchase
  - **Chat with Seller** - Real-time messaging
  - **Exchange Book** - Propose book exchange
- Wishlist management
- Transaction history

### 2. Smart Book Exchange

**How it works:**
1. User finds a book they want
2. User selects their book to offer in exchange
3. System calculates both book values using valuation algorithm
4. System shows value difference
5. If difference exists, shows amount to pay/receive
6. Exchange request sent to seller
7. Seller can accept, reject, or counter-offer
8. Upon acceptance, payment processed (if needed)
9. Both parties exchange books
10. Exchange marked complete

**Value Calculation:**
```
Value Difference = Requested Book Value - Offered Book Value

If Difference > 0: User pays additional amount
If Difference < 0: User receives money back
If Difference = 0: Direct exchange, no payment
```

### 3. Smart Book Valuation

**Algorithm considers:**
- **Condition** (30%): new, like-new, good, fair, poor
- **Age Depreciation** (20%): Publication year vs current year
- **Market Demand** (25%): Views, favorites, similar sales
- **Rarity** (15%): Availability in marketplace
- **Original Price** (10%): Listed original price

### 4. Real-time Chat System
- One-on-one messaging
- Real-time delivery with Socket.io
- Message history
- Read receipts
- Online/offline status
- File/image sharing

### 5. Recommendation Engine
- Collaborative filtering
- Content-based recommendations
- Trending books
- Personalized suggestions

### 6. Transaction Management
- Secure payment processing (Stripe)
- Order tracking
- Invoice generation
- Refund handling
- Transaction history

### 7. Rating & Feedback
- 5-star rating system
- Written reviews
- Verified purchase badges
- Review helpfulness voting
- Seller rating aggregation

### 8. Admin Dashboard
- User management
- Seller verification
- Transaction monitoring
- Platform statistics
- Content moderation
- Dispute resolution

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL/NoSQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- HTTPS enforcement
- Secure file upload
- PCI-DSS compliant payments (Stripe)

## 📊 Database Collections

1. **Users** - User accounts and profiles
2. **Books** - Book listings
3. **Transactions** - Purchase records
4. **Exchanges** - Exchange proposals
5. **Chats** - Chat room metadata
6. **Messages** - Chat messages
7. **Reviews** - Ratings and reviews
8. **Wishlists** - User wishlists
9. **Notifications** - System notifications
10. **Valuations** - Book valuation history

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book listing
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Exchanges
- `POST /api/exchanges` - Create exchange request
- `GET /api/exchanges/:id` - Get exchange details
- `PUT /api/exchanges/:id/accept` - Accept exchange
- `PUT /api/exchanges/:id/reject` - Reject exchange
- `PUT /api/exchanges/:id/counter` - Counter offer

### Transactions
- `POST /api/transactions/purchase` - Create purchase
- `GET /api/transactions/:id` - Get transaction
- `PUT /api/transactions/:id/status` - Update status

### Chat
- `GET /api/chats` - Get user chats
- `POST /api/chats` - Create chat
- `GET /api/chats/:id/messages` - Get messages
- `POST /api/chats/:id/messages` - Send message

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/book/:bookId` - Get book reviews
- `GET /api/reviews/user/:userId` - Get user reviews

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:bookId` - Remove from wishlist

*See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference*

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📦 Deployment

### Backend Deployment (Railway/Heroku/AWS)
```bash
# Build for production
npm run build

# Set environment variables
# Deploy using platform CLI or Git integration
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy
vercel deploy --prod
# or
netlify deploy --prod
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
CLIENT_URL=https://your-frontend-url.com
```

**Frontend (.env)**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🎨 UI/UX Features

- Responsive design (mobile, tablet, desktop)
- Modern and clean interface
- Intuitive navigation
- Loading states and skeletons
- Error handling with user-friendly messages
- Toast notifications
- Smooth animations
- Accessible components

## 🔄 Development Workflow

1. **Planning** - Review requirements and design
2. **Setup** - Initialize project and install dependencies
3. **Backend Development** - Models, controllers, routes
4. **Frontend Development** - Components, pages, features
5. **Integration** - Connect frontend with backend
6. **Testing** - Unit, integration, E2E tests
7. **Optimization** - Performance and security
8. **Deployment** - Deploy to production
9. **Monitoring** - Track errors and performance

## 📈 Performance Optimization

- Database indexing
- Query optimization
- Pagination for large datasets
- Image optimization and lazy loading
- Code splitting
- Caching with Redis
- CDN for static assets
- Compression (Gzip)

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check MongoDB is running
# Verify MONGODB_URI in .env
# Check network connectivity
```

**CORS Error**
```bash
# Verify CLIENT_URL in backend .env
# Check CORS configuration in server.js
```

**Socket.io Connection Failed**
```bash
# Verify SOCKET_URL in frontend .env
# Check Socket.io server configuration
# Ensure ports are not blocked
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Stripe for payment processing
- Cloudinary for image hosting
- All open-source contributors

## 📞 Support

For support, email support@bookmarketplace.com or join our Slack channel.

## 🗺 Roadmap

### Version 1.0 (Current)
- ✅ User authentication
- ✅ Book listing and browsing
- ✅ Exchange system
- ✅ Real-time chat
- ✅ Payment integration
- ✅ Reviews and ratings

### Version 2.0 (Planned)
- [ ] Mobile applications (React Native)
- [ ] Social features (follow sellers)
- [ ] Book clubs and communities
- [ ] Auction system
- [ ] Subscription plans
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Blockchain integration

## 📊 Project Statistics

- **Total Collections**: 10
- **API Endpoints**: 50+
- **Features**: 15+
- **Estimated Development Time**: 30 days
- **Tech Stack Components**: 20+

---

**Happy Coding! 📚✨**
