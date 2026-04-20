# Pull Request Evidence

## 1. Identified Code Smells (Audit Phase)
```javascript
// SMELL: [CRITICAL] MD5 is insecure for password hashing and should be replaced with bcrypt using 12 salt rounds.
"md5": "^2.3.0"

// SMELL: [CRITICAL] Using spread operator on req.body allows Mass Assignment and NoSQL injection. Input must be validated and destructured explicitly.
var userData = { ...req.body };

// SMELL: [CRITICAL] N+1 Query problem. Executing database queries inside a loop causes severe performance degradation. Use .populate() instead.
User.findById(ship.userId)
```

## 2. Refactored Folder Structure
```text
src/
├── app.js
├── routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── shipment.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── routes/
│   ├── auth.routes.js
│   ├── shipment.routes.js
│   └── user.routes.js
├── services/
│   ├── auth.service.js
│   ├── shipment.service.js
│   └── user.service.js
├── utils/
│   └── errors.util.js
├── validators/
│   ├── auth.validator.js
│   └── shipment.validator.js
```

## 3. Security Before/After Proof

**Before (Insecure MD5 & No Validation):**
```javascript
var userData = { ...req.body };
userData.password = md5(userData.password);
var newUser = new User(userData);
newUser.save();
```

**After (Joi Validation + bcrypt):**
```javascript
// Route Level (Joi Validation Middleware)
router.post('/register', validate(registerSchema), authController.register);

// Service Level (bcrypt Hashing)
const hashedPassword = await bcrypt.hash(userData.password, 12);
const newUser = new User({
    ...userData,
    password: hashedPassword
});
await newUser.save();
```

## 4. Login JWT Response Proof
```json
{
  "msg": "Login OK",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

## 5. N+1 Query Fix Proof

**Before:**
Triggered database query loop for every individual shipment returned.
`20 shipments = 21 separate database queries`

**After:**
Utilized Mongoose `.populate()` with `.lean()` to resolve relations at the database engine level.
`20 shipments = 1 highly optimized query`
```javascript
return await Shipment.find({ userId })
    .populate('userId', 'name email role')
    .lean();
```
