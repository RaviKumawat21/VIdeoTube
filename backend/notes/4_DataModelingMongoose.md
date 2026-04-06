Here are the complete, structured lecture notes for the "Data Modelling for Backend with Mongoose" lecture by Hitesh Choudhary (Chai aur Code).

***

# 📝 Lecture Notes: Data Modelling with Mongoose

**Lecture:** Data modelling for backend with Mongoose (Chai aur Backend Series)  
**Instructor:** Hitesh Choudhary

## 1. The Philosophy of Backend Design
Before writing a single line of code, a backend engineer must change their approach to problem-solving.

### **The "Data-First" Approach**
*   **Mistake:** Beginners often start by writing controllers (e.g., "How do I take email/password and log a user in?").
*   **Professional Approach:** Start by asking **"What data are we storing?"**
*   **Key Questions to Ask:**
    *   What specific fields do we need? (e.g., Is `username` enough, or do we need `firstName` and `lastName`?)
    *   Are there images/files? Where will they be stored?
    *   How are these data points connected? (Relationships)

### **Tools for Data Modelling**
1.  **Moon Modeler:** A professional (often paid) tool used in corporations. It allows you to visually draw schemas and generates Mongoose code automatically.
2.  **Eraser.io:** A popular tool for drawing Entity-Relationship (ER) diagrams.
3.  **Pen & Paper:** The most accessible and often best tool for beginners to draft the initial structure.

***

## 2. Designing the Data Model (Mental Exercise)
The lecture walks through designing a "Todo" application.

### **Phase 1: User Model**
*   **Fields needed:** `username`, `email`, `password`.
*   **Evolution:** If we add a `profilePicture` field later, the entire structure might need to change. Hence, plan fields early.

### **Phase 2: Todo Model (The Complexity)**
*   **Structure:** A Todo app isn't just a single list. It usually has:
    *   **Major Todos (Lists):** e.g., "Work Tasks", "Gym Goals".
    *   **Sub-Todos (Items):** The actual checklist items inside a Major Todo.
*   **Relationships:**
    *   A **Major Todo** must be linked to the **User** who created it.
    *   A **Major Todo** contains an array of **Sub-Todos**.

***

## 3. Implementation & Project Setup
The lecture uses **StackBlitz** (an online IDE) to avoid local environment setup issues, but the code works identically in VS Code.

### **Standard Folder Structure**
Professionals organize models in a dedicated folder.
```text
src/
└── models/
    ├── todos/
    │   ├── user.models.js     <-- Note the naming convention
    │   ├── todo.models.js
    │   └── sub_todo.models.js
```
*   **Naming Convention:** Using `.models.js` (e.g., `user.models.js`) makes it instantly clear what the file contains when searching or tab-switching.

### **Step 1: The User Model (`user.models.js`)**
This is the foundation. We use `mongoose.Schema` to define the structure.

**Key Concepts Covered:**
*   **`timestamps: true`:** Automatically adds `createdAt` and `updatedAt` fields.
*   **Field Options:** `required`, `unique`, `lowercase`.

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'], // Custom error message
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// "User" becomes "users" (lowercase, plural) in MongoDB
export const User = mongoose.model('User', userSchema);
```

### **Step 2: The Sub-Todo Model (`sub_todo.models.js`)**
These are the individual checkboxes (e.g., "Do 10 pushups").

```javascript
import mongoose from 'mongoose';

const subTodoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
  },
  { timestamps: true }
);

export const SubTodo = mongoose.model('SubTodo', subTodoSchema);
```

### **Step 3: The Todo Model (`todo.models.js`)**
This is the main list container that links everything together.

**Key Concepts Covered:**
*   **References (`ref`):** How to link one model to another.
*   **Array of References:** Storing multiple Sub-Todos in one Todo.

```javascript
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links this Todo to a specific User
    },
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTodo', // Array of SubTodo IDs
      },
    ],
  },
  { timestamps: true }
);

export const Todo = mongoose.model('Todo', todoSchema);
```

***

## 📚 Extra Important Concepts (Not Covered in Lecture)

While the lecture covers the structural basics, production-grade applications require a few more advanced Mongoose features.

### 1. Password Hashing (Pre-save Hooks)
**Why:** You should **never** store passwords as plain text (as shown in the basic schema).  
**Solution:** Use Mongoose "pre-save" hooks with a library like `bcrypt` to hash passwords before saving.

```javascript
// Inside user.models.js (requires: npm install bcrypt)
import bcrypt from "bcrypt"

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### 2. Custom Methods (Instance Methods)
**Why:** Instead of writing password checking logic in your controller every time, put it directly on the model.

```javascript
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
```

### 3. Enum Validation
**Why:** Restrict a string field to a specific set of allowed values (e.g., User Roles).

```javascript
role: {
    type: String,
    enum: ["USER", "ADMIN", "MODERATOR"],
    default: "USER"
}
```

### 4. Pagination with `mongoose-aggregate-paginate-v2`
**Why:** When fetching Todos, you can't fetch 1,000,000 items at once. Pagination is essential for backend performance.
*   **Installation:** `npm install mongoose-aggregate-paginate-v2`
*   **Usage:**
    ```javascript
    import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
    todoSchema.plugin(mongooseAggregatePaginate);
    ```

### 5. Select: false
**Why:** To prevent sensitive data (like passwords) from being returned in queries by default.

```javascript
password: {
    type: String,
    required: true,
    select: false // Will not return password in queries unless explicitly asked
}
```

