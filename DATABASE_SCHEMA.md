# Database Schema Design

## MongoDB Collections

### 1. Users Collection

**Purpose**: Store user accounts (buyers, sellers, admins)

```javascript
{
  _id: ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Don't return in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
    index: true
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,  // URL to profile image
    bio: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  sellerInfo: {
    businessName: String,
    description: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    totalExchanges: {
      type: Number,
      default: 0
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date
  },
  wallet: {
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.users.createIndex({ email: 1 })
db.users.createIndex({ username: 1 })
db.users.createIndex({ role: 1 })
db.users.createIndex({ "sellerInfo.rating": -1 })
```

---

### 2. Books Collection

**Purpose**: Store book listings

```javascript
{
  _id: ObjectId,
  sellerId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,  // Allow multiple null values
    index: true
  },
  description: {
    type: String,
    maxlength: 2000
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: true,
    index: true
  },
  images: [{
    type: String,  // URLs to images
    required: true
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  estimatedValue: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    enum: [
      'fiction',
      'non-fiction',
      'academic',
      'textbook',
      'comics',
      'magazines',
      'children',
      'young-adult',
      'biography',
      'history',
      'science',
      'technology',
      'self-help',
      'cooking',
      'art',
      'other'
    ],
    required: true,
    index: true
  },
  genre: [{
    type: String
  }],
  language: {
    type: String,
    default: 'English'
  },
  publicationYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear() + 1
  },
  publisher: String,
  pages: {
    type: Number,
    min: 1
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook', 'audiobook'],
    index: true
  },
  listingType: {
    type: String,
    enum: ['sale', 'exchange', 'both'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'exchanged', 'reserved', 'inactive'],
    default: 'available',
    index: true
  },
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  soldAt: Date,
  exchangedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.books.createIndex({ title: "text", author: "text", description: "text" })
db.books.createIndex({ sellerId: 1, status: 1 })
db.books.createIndex({ category: 1, status: 1 })
db.books.createIndex({ price: 1 })
db.books.createIndex({ listingType: 1, status: 1 })
db.books.createIndex({ createdAt: -1 })
db.books.createIndex({ views: -1 })
db.books.createIndex({ "location.city": 1 })
```

---

### 3. Transactions Collection

**Purpose**: Store purchase and exchange transactions

```javascript
{
  _id: ObjectId,
  transactionType: {
    type: String,
    enum: ['purchase', 'exchange'],
    required: true,
    index: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  buyerId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sellerId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookId: {
    type: ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  platformFee: {
    type: Number,
    default: 0,
    min: 0
  },
  sellerAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet', 'cash', 'exchange'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentIntentId: String,  // Stripe payment intent ID
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    receiptUrl: String
  },
  status: {
    type: String,
    enum: ['initiated', 'payment-pending', 'payment-completed', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'initiated',
    index: true
  },
  shippingDetails: {
    address: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String
    },
    trackingNumber: String,
    carrier: String,
    shippingStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'in-transit', 'out-for-delivery', 'delivered', 'failed'],
      default: 'pending'
    },
    shippedAt: Date,
    deliveredAt: Date
  },
  refund: {
    requested: Boolean,
    requestedAt: Date,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed']
    },
    amount: Number,
    processedAt: Date
  },
  notes: String,
  metadata: Object,
  completedAt: Date,
  cancelledAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.transactions.createIndex({ transactionId: 1 })
db.transactions.createIndex({ buyerId: 1, createdAt: -1 })
db.transactions.createIndex({ sellerId: 1, createdAt: -1 })
db.transactions.createIndex({ status: 1 })
db.transactions.createIndex({ paymentStatus: 1 })
db.transactions.createIndex({ createdAt: -1 })
```

---

### 4. Exchanges Collection

**Purpose**: Store book exchange proposals and negotiations

```javascript
{
  _id: ObjectId,
  exchangeId: {
    type: String,
    unique: true,
    required: true
  },
  initiatorId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiverId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  requestedBookId: {
    type: ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  offeredBookId: {
    type: ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  requestedBookValue: {
    type: Number,
    required: true,
    min: 0
  },
  offeredBookValue: {
    type: Number,
    required: true,
    min: 0
  },
  valueDifference: {
    type: Number,
    default: 0
  },
  additionalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentRequired: {
    type: Boolean,
    default: false
  },
  paymentDirection: {
    type: String,
    enum: ['initiator-pays', 'receiver-pays', 'none'],
    default: 'none'
  },
  paymentStatus: {
    type: String,
    enum: ['not-required', 'pending', 'completed', 'failed'],
    default: 'not-required'
  },
  paymentIntentId: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'counter-offered', 'payment-pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  counterOffer: {
    additionalAmount: Number,
    message: String,
    offeredAt: Date
  },
  negotiationHistory: [{
    action: {
      type: String,
      enum: ['created', 'counter-offered', 'accepted', 'rejected', 'cancelled']
    },
    userId: ObjectId,
    amount: Number,
    message: String,
    timestamp: Date
  }],
  notes: String,
  shippingDetails: {
    initiatorTracking: String,
    receiverTracking: String,
    initiatorShipped: Boolean,
    receiverShipped: Boolean,
    initiatorReceived: Boolean,
    receiverReceived: Boolean
  },
  completedAt: Date,
  cancelledAt: Date,
  cancelledBy: ObjectId,
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.exchanges.createIndex({ exchangeId: 1 })
db.exchanges.createIndex({ initiatorId: 1, status: 1 })
db.exchanges.createIndex({ receiverId: 1, status: 1 })
db.exchanges.createIndex({ status: 1 })
db.exchanges.createIndex({ createdAt: -1 })
```

---

### 5. Chats Collection

**Purpose**: Store chat room metadata

```javascript
{
  _id: ObjectId,
  participants: [{
    type: ObjectId,
    ref: 'User',
    required: true
  }],
  bookId: {
    type: ObjectId,
    ref: 'Book',
    index: true
  },
  lastMessage: {
    text: String,
    senderId: ObjectId,
    timestamp: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  archivedBy: [{
    type: ObjectId,
    ref: 'User'
  }],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.chats.createIndex({ participants: 1 })
db.chats.createIndex({ bookId: 1 })
db.chats.createIndex({ updatedAt: -1 })
```

---

### 6. Messages Collection

**Purpose**: Store chat messages

```javascript
{
  _id: ObjectId,
  chatId: {
    type: ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  senderId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiverId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'exchange-offer', 'system'],
    default: 'text'
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  attachments: [{
    url: String,
    type: String,
    name: String,
    size: Number
  }],
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  metadata: {
    exchangeId: ObjectId,
    bookId: ObjectId,
    transactionId: ObjectId
  },
  createdAt: Date
}

// Indexes
db.messages.createIndex({ chatId: 1, createdAt: -1 })
db.messages.createIndex({ senderId: 1 })
db.messages.createIndex({ isRead: 1 })
```

---

### 7. Reviews Collection

**Purpose**: Store ratings and reviews

```javascript
{
  _id: ObjectId,
  reviewerId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reviewedUserId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  transactionId: {
    type: ObjectId,
    ref: 'Transaction',
    required: true,
    index: true
  },
  bookId: {
    type: ObjectId,
    ref: 'Book',
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  helpful: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: ObjectId,
    ref: 'User'
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'reported', 'removed'],
    default: 'active',
    index: true
  },
  reportedBy: [{
    userId: ObjectId,
    reason: String,
    reportedAt: Date
  }],
  sellerResponse: {
    comment: String,
    respondedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.reviews.createIndex({ reviewerId: 1 })
db.reviews.createIndex({ reviewedUserId: 1, status: 1 })
db.reviews.createIndex({ transactionId: 1 })
db.reviews.createIndex({ rating: -1 })
db.reviews.createIndex({ createdAt: -1 })
```

---

### 8. Wishlists Collection

**Purpose**: Store user wishlists

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookId: {
    type: ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  notifyOnPriceChange: {
    type: Boolean,
    default: false
  },
  targetPrice: {
    type: Number,
    min: 0
  },
  notifyOnAvailability: {
    type: Boolean,
    default: true
  },
  notes: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
}

// Indexes
db.wishlists.createIndex({ userId: 1, bookId: 1 }, { unique: true })
db.wishlists.createIndex({ userId: 1, addedAt: -1 })
db.wishlists.createIndex({ bookId: 1 })
```

---

### 9. Notifications Collection

**Purpose**: Store user notifications

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'exchange-request',
      'exchange-accepted',
      'exchange-rejected',
      'exchange-counter',
      'message',
      'price-alert',
      'availability-alert',
      'transaction',
      'payment',
      'shipping',
      'review',
      'system',
      'promotion'
    ],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  relatedId: ObjectId,
  relatedModel: {
    type: String,
    enum: ['Book', 'Transaction', 'Exchange', 'Chat', 'Review', 'User']
  },
  actionUrl: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  isSent: {
    type: Boolean,
    default: false
  },
  sentAt: Date,
  createdAt: Date
}

// Indexes
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 })
db.notifications.createIndex({ type: 1 })
db.notifications.createIndex({ createdAt: -1 })
```

---

### 10. Valuations Collection

**Purpose**: Store book valuation history and calculations

```javascript
{
  _id: ObjectId,
  bookId: {
    type: ObjectId,
    ref: 'Book',
    index: true
  },
  isbn: {
    type: String,
    index: true
  },
  calculatedValue: {
    type: Number,
    required: true,
    min: 0
  },
  factors: {
    conditionScore: {
      value: Number,
      weight: Number
    },
    ageDepreciation: {
      value: Number,
      weight: Number
    },
    marketDemand: {
      value: Number,
      weight: Number
    },
    rarity: {
      value: Number,
      weight: Number
    },
    originalPrice: {
      value: Number,
      weight: Number
    }
  },
  marketData: {
    averagePrice: Number,
    totalListings: Number,
    recentSales: Number,
    demandScore: Number
  },
  algorithmVersion: {
    type: String,
    required: true
  },
  calculatedBy: {
    type: String,
    enum: ['system', 'manual', 'api'],
    default: 'system'
  },
  createdAt: Date
}

// Indexes
db.valuations.createIndex({ bookId: 1, createdAt: -1 })
db.valuations.createIndex({ isbn: 1 })
db.valuations.createIndex({ createdAt: -1 })
```

---

## Relationships Diagram

```
Users (1) ──────< (N) Books
  │                    │
  │                    │
  │                    ├──< (N) Wishlists
  │                    │
  │                    ├──< (N) Reviews
  │                    │
  │                    └──< (N) Valuations
  │
  ├──< (N) Transactions
  │         │
  │         └──< (1) Reviews
  │
  ├──< (N) Exchanges
  │
  ├──< (N) Chats ──────< (N) Messages
  │
  └──< (N) Notifications
```

## Data Integrity Rules

1. **Cascade Delete**: When a user is deleted, soft-delete their books (set isActive = false)
2. **Transaction Integrity**: Transactions cannot be deleted, only marked as cancelled
3. **Review Constraints**: One review per transaction per user
4. **Exchange Constraints**: Cannot exchange the same book multiple times simultaneously
5. **Chat Constraints**: One chat per book per user pair
6. **Wishlist Constraints**: Unique userId + bookId combination

## Backup Strategy

1. **Daily Full Backup**: Complete database backup
2. **Hourly Incremental**: Transaction and message collections
3. **Retention**: 30 days for daily, 7 days for hourly
4. **Point-in-Time Recovery**: Enabled for critical collections
