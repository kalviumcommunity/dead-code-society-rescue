# Database Query Optimization

## N+1 Query Problem - FIXED ✅

### Before (Deprecated in src/routes.js)
```javascript
// Problem: 1 query for shipments + N queries for each user = N+1 queries
Shipment.find({ userId: req.userId })
    .then(function(shipments) {
        for (var i = 0; i < shipments.length; i++) {
            User.findById(shipments[i].userId)  // ❌ Loop causes N extra queries
                .then(function(user) { ... });
        }
    });
```

**Result for 10 shipments: 11 database queries**

### After (Current in src/services/shipmentService.js)
```javascript
// Solution: Use .populate() for single query with join
Shipment.find({ userId }).populate('userId', 'name email')
```

**Result for 10 shipments: 1 database query**

---

## Query Optimization Summary

### User Service
| Operation | Query | Queries |
|-----------|-------|---------|
| Register | INSERT into User | 1 |
| Login | FINDONE by email | 1 |
| Get Profile | FINDBYID | 1 |

### Shipment Service
| Operation | Query | Queries | Optimization |
|-----------|-------|---------|---------------|
| Create | INSERT | 1 | Direct write |
| Get All | FIND with .populate() | 1 | Join in query |
| Get One | FINDBYID with .populate() | 1 | Join in query |
| Update Status | FINDBYIDANDUPDATE | 1 | Atomic operation |
| Delete | FINDBYID + DELETE | 2 | Verify + delete |

---

## Query Debugging

### Enable Query Logging
```javascript
const queryDebug = require('./src/utils/queryDebug');

// Start tracking
queryDebug.startTracking();

// ... run operations ...

// Get summary
const summary = queryDebug.getSummary();
console.log(`Total queries executed: ${summary.totalQueries}`);
console.log(summary.queryLog);

// Reset
queryDebug.resetTracking();
```

### Example Console Output
```
[Query #1] FIND with POPULATE on Shipment { userId: '507f1f77bcf86cd799439011' }
[Query #2] INSERT on User { email: 'user@example.com' }
[Query #3] FINDONE on User { email: 'user@example.com' }
Total queries executed: 3
```

---

## Best Practices Used

✅ **Populate joins** - Fetch related documents in single query  
✅ **Field selection** - Only fetch needed fields (`'name email'`)  
✅ **Atomic operations** - Use `findByIdAndUpdate` to avoid race conditions  
✅ **Early validation** - Check permissions before modifying data  
✅ **Query logging** - Built-in debugging for query analysis  

---

## Performance Impact

- **Before**: Fetching 10 shipments = 11 queries
- **After**: Fetching 10 shipments = 1 query
- **Improvement**: 91% reduction in database calls ✅
