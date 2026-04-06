Here are the complete, structured lecture notes for the **"Ecommerce and Hospital Management Data Modelling"** lecture by Hitesh Choudhary (Chai aur Code).

***

# 📝 Lecture Notes: Advanced Data Modelling

**Lecture:** E-commerce & Hospital Management Data Modelling
**Instructor:** Hitesh Choudhary

## 1. Project Overview
This lecture moves beyond basic "Todo" lists to complex, real-world scenarios. The goal is to understand how different data models interact, how to handle relationships, and standard industry practices for defining schemas.

**Two Major Projects Covered:**
1.  **E-commerce Store:** Handling users, products, categories, and complex orders.
2.  **Hospital Management System:** Managing doctors, patients, and hospitals (and their complex relationships).

***

## 2. Project A: E-commerce Data Model

### **1. User Model (`user.models.js`)**
Standard user profile. Similar to previous lectures but critical for linking orders.
*   **Fields:** `username`, `email`, `password`.
*   **Key Validations:** `required`, `unique`, `lowercase`.

```javascript
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const User = mongoose.model("User", userSchema)
```

### **2. Category Model (`category.models.js`)**
Every product belongs to a category (e.g., Electronics, Books).
*   **Design Choice:** Kept separate to allow independent management (admin can add/edit categories easily).

```javascript
import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {timestamps: true})

export const Category = mongoose.model("Category", categorySchema)
```

### **3. Product Model (`product.models.js`)**
This model links to both `Category` and `User` (the owner/admin who added it).

**Key Concepts:**
*   **Image Handling:** Do **not** store images as binary (Buffer) in MongoDB. It makes the DB heavy.
    *   *Best Practice:* Upload images to a service like **Cloudinary** or **AWS S3**, get a public URL, and store that URL as a `String`.
*   **Relationships:** Uses `ObjectId` to link to `Category`.

```javascript
import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    productImage: {
        type: String, // Stores the URL from Cloudinary/AWS
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true})

export const Product = mongoose.model("Product", productSchema)
```

### **4. Order Model (`order.models.js`) - *The Complex Part***
An order isn't just a link to a product. A user can buy *5 units* of *Product A* and *2 units* of *Product B*.

**The Challenge:** How to store "Quantity" for each product in an order?
**The Solution:** Create a **Sub-Schema** (Mini-model).

#### **A. The Sub-Schema (`orderItemSchema`)**
This is a schema that is *not* exported as a model but is used inside the main Order schema to define the structure of the items array.

```javascript
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }
})
```

#### **B. The Main Order Schema**
**Key Concepts:**
*   **Enums (Enumeration):** Restricting a field to a specific set of allowed values. Used for `status` to prevent typos (e.g., ensuring someone doesn't type "shippped" vs "SHIPPED").
*   **Array of Schemas:** `orderItems` is an array of the structure defined above.

```javascript
import mongoose from "mongoose"

// Mini-schema defined internally
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderItems: {
        type: [orderItemSchema] // Array of the mini-schema
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "DELIVERED"], // Restricts values
        default: "PENDING"
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)
```

***

## 3. Project B: Hospital Management Data Model
*Note: The lecture sets up the file structure and boilerplates for this system but cuts off before fully implementing the fields. The structure below is based on the setup provided in the lecture and completed in the "Extra Content" section.*

### **Required Models**
1.  `doctor.models.js`
2.  `patient.models.js`
3.  `hospital.models.js`
4.  `medical_record.models.js`

### **Boilerplate Setup**
The lecture emphasizes consistency. Every file follows the standard pattern:
1.  Import mongoose.
2.  Define Schema (`new mongoose.Schema({...}, {timestamps: true})`).
3.  Export Model (`mongoose.model("Name", schema)`).

***

## 📚 Extra Important Content (Completing the Hospital Design)

Since the lecture setup the files but didn't detail the fields for the Hospital system, here is the **industry-standard implementation** for these models, focusing on the complex **Many-to-Many** relationship between Doctors and Hospitals.

### **1. The Concept: Many-to-Many**
*   **Scenario:** A Doctor can work at multiple Hospitals. A Hospital has multiple Doctors.
*   **Implementation:** We cannot just put a single `hospitalId` in the Doctor model. We need an **Array** of IDs, or a separate mapping model.

### **2. Hospital Model**
```javascript
// hospital.models.js
import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    specializedIn: [
        { type: String } // Array of strings, e.g. ["Heart", "Kidney"]
    ]
}, { timestamps: true });

export const Hospital = mongoose.model("Hospital", hospitalSchema);
```

### **3. Patient Model**
A patient is usually admitted to *one* hospital at a time, but we might want to track history. For active management:
```javascript
// patient.models.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    diagnosedWith: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["M", "F", "O"],
        required: true
    },
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }
}, { timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);
```

### **4. Medical Record Model**
This acts as a history log linking everything together.
```javascript
// medical_record.models.js
import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    // ... fields
}, { timestamps: true });

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
```

### **5. Doctor Model (The Complex One)**
This model needs to handle the fact that a doctor works in multiple places, potentially with different hours at each.

```javascript
// doctor.models.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experienceInYears: {
        type: Number,
        default: 0
    },
    // MANY-TO-MANY RELATIONSHIP
    worksInHospitals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        }
    ]
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema);
```

### **Advanced Concept: Pivot Models (Alternative Approach)**
In very complex systems, storing `worksInHospitals` as an array inside Doctor is not enough (e.g., "Dr. A works at Hospital X from 9-5" and "Hospital Y from 6-9").
In that case, you create a separate model effectively representing a "Shift" or "Employment":

```javascript
// doctor_hospital_mapping.models.js (Theoretical)
const doctorEmploymentSchema = new mongoose.Schema({
    doctorId: { ref: "Doctor" },
    hospitalId: { ref: "Hospital" },
    shiftStartTime: String,
    workingDays: [String] // ["Mon", "Wed"]
})
```

[1](https://www.youtube.com/watch?v=lA_mNpddN5U)