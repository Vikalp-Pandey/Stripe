
/*
User clicks Buy Plan
        ↓
Create Stripe Checkout Session
        ↓
Stripe Webhook (checkout.session.completed)
        ↓
SAVE PLAN RECORD IN DATABASE  
        ↓
Frontend calls /my-plans API
        ↓
Show plan history / summary

*/

import { Schema, model, Types } from 'mongoose';

const planHistorySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    planId: {
      type: String,
      required: true,
    },

    planName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: function(){
        if (this.status === 'cancelled') return 'cancelled';
        const now = new Date();
        if (now > this.expiresAt) {
          return 'expired';
        }
        return 'active';
      },
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { 
    timestamps: true,
    // CRITICAL: This allows the virtual 'status' to show up in API responses
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
   }
);

// Virtual: Purely fresh calculated data (not stored in db), only shown in response
planHistorySchema.virtual('currentStatus').get(function() {
  if (this.status === 'cancelled') return 'cancelled';
  
  const now = new Date();
  return now > this.expiresAt ? 'expired' : 'active';
});

// Set TTL Index(so instances delete automatically)
// planHistorySchema.index({expiresAt:1},{expireAfterSeconds:25}) // after 30 days

export default model('PlanHistory', planHistorySchema);


/*
*1. The Key Selector (First Argument)
This tells MongoDB which field to monitor and in what order (1 for ascending, -1 for descending).

Example: { expiresAt: 1 }

*2. The Options Object (Second Argument)
This is where you define the "special powers" of the index, like making it a TTL index or making it unique.

Example: { expireAfterSeconds: 2592000 }
);

Technically, no. It only takes these two main arguments.
 However, the Options Object (the second argument) can hold many different settings at once:
 
 Option,                           What it does
expireAfterSeconds,            Turns it into a TTL Index (Auto-delete).
unique,                         Ensures no two documents have the same value.
background,(Default true)        Builds the index without locking your DB.
name,                          "Gives your index a custom name (e.g., ""delete_after_30_days"")."
 
 */

/*
 ^ The Core Purposes of Virtuals
1. Data Transformation (Concatenation)
The classic example is a fullName. Instead of storing firstName, lastName, AND fullName (which wastes space and can get out of sync), you store the first two and create a virtual for the third.

DB stores: { "first": "Jane", "last": "Doe" }

App sees: user.fullName // "Jane Doe"

2. Real-Time Logic (Your Status Case)
This is exactly why we used it for your planHistorySchema.

Without Virtual: You have to run a "cron job" or a background script every minute to check if a plan is expired and update a string in the DB.

With Virtual: You just store the expiresAt date. When you access the document, the virtual compares that date to Date.now() and tells you if it's "active" or "expired" instantly.

3. Formatting
You might store a price as an integer in cents (to avoid floating-point math errors) but want to display it as a formatted string.

DB stores: 4999

Virtual returns: "$49.99"
 */