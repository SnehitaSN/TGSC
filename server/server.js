// server.js

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors"); // Import the cors package
require("dotenv").config(); // Load environment variables from .env file
const nodemailer = require("nodemailer"); // Import nodemailer
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const crypto = require("crypto"); // ⭐ Import crypto for token generation
const path = require("path"); // ⭐ ADDED: Import the 'path' module

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// app.use(cors()); // Enable CORS for all routes
// app.use(express.json()); // Enable JSON body parsing

// Configure CORS to only allow requests from your Vercel frontend URL
// The CLIENT_URL should be set as an environment variable on Render
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000' // Allow for local development
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions)); // ⭐ UPDATED: Use the configured corsOptions
app.use(express.json()); // Enable JSON body parsing

// ⭐ Configure Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Nodemailer Transporter Setup
// IMPORTANT: Replace with your actual email service credentials
// For development, you can use a service like Mailtrap.io or Ethereal Email.
// For production, use a robust service like SendGrid, Mailgun, AWS SES, etc.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.sendgrid.net' or 'smtp.ethereal.email'
  port: process.env.EMAIL_PORT, // e.g., 587 for TLS, 465 for SSL
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address or API key
    pass: process.env.EMAIL_PASS, // Your email password or API key password
  },
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to PostgreSQL database at:", result.rows[0].now);
  });
});

// ⭐ NEW: JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey"; // Use a strong, random key in .env

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"; // ⭐ Ensure this line exists and is correct

// // Middleware to protect routes and get user ID
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token == null) return res.sendStatus(401); // No token

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403); // Invalid token
//         req.user = user; // Set req.user to the decoded JWT payload
//         next();
//     });
// };

// ⭐ Your authenticateToken middleware (should be defined somewhere in server.js)

// Ensure process.env.JWT_SECRET is set in your .env file
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      // If token is invalid or expired, send 403 Forbidden
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid or expired token." });
    }
    req.user = user; // 'user' payload from JWT (e.g., { id: user_id, email: user_email })
    next();
  });
};

// ⭐ Route to create a new order
app.post("/api/orders", authenticateToken, async (req, res) => {
  const { cartItems, totalAmount, shippingInfo, paymentMethod, transactionId } =
    req.body;

  const userId = req.user.id;

  if (
    !cartItems ||
    cartItems.length === 0 ||
    !totalAmount ||
    !shippingInfo ||
    !shippingInfo.fullName
  ) {
    return res.status(400).json({ message: "Missing required order details." });
  }

  const requiredShippingFields = [
    "fullName",
    "address",
    "city",
    "state",
    "zip",
    "country",
  ];
  for (const field of requiredShippingFields) {
    if (!shippingInfo[field]) {
      return res
        .status(400)
        .json({ message: `Shipping ${field} is required.` });
    }
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const orderInsertQuery = `
            INSERT INTO orders (
                user_id, total_amount, order_status, payment_status, payment_method, transaction_id,
                shipping_full_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, created_at, order_status;
        `;
    const orderResult = await client.query(orderInsertQuery, [
      userId,
      totalAmount,
      "Processing",
      transactionId ? "Paid" : "Pending",
      paymentMethod,
      transactionId,
      shippingInfo.fullName,
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.state,
      shippingInfo.zip,
      shippingInfo.country,
    ]);
    const orderId = orderResult.rows[0].id;

    for (const item of cartItems) {
      const itemInsertQuery = `
                INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
                VALUES ($1, $2, $3, $4, $5);
            `;
      await client.query(itemInsertQuery, [
        orderId,
        item.productId,
        item.name,
        item.price,
        item.quantity,
      ]);
    }

    // ⭐ Optional: Clear the user's cart after order is placed
    // This assumes a 'carts' and 'cart_items' table structure
    await client.query(
      "DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)",
      [userId]
    );

    await client.query("COMMIT");
    res.status(201).json({
      message: "Order placed successfully!",
      orderId: orderId,
      status: orderResult.rows[0].order_status,
      createdAt: orderResult.rows[0].created_at,
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ message: "Failed to place order. Please try again." });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// ⭐ Route to get specific order details
app.get("/api/orders/:orderId", authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id; // Get user ID from authenticated token

  try {
    // Fetch order details including shipping info
    const orderQuery = `
            SELECT
                o.id,
                o.total_amount,
                o.order_status,
                o.payment_status,
                o.payment_method,
                o.transaction_id,
                o.shipping_full_name,
                o.shipping_address,
                o.shipping_city,
                o.shipping_state,
                o.shipping_zip,
                o.shipping_country,
                o.created_at
            FROM orders o
            WHERE o.id = $1 AND o.user_id = $2; -- Ensure user can only view their own order
        `;
    const orderResult = await pool.query(orderQuery, [orderId, userId]);
    const order = orderResult.rows[0];

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not authorized." });
    }

    // Fetch order items for this order
    const itemsQuery = `
            SELECT
                id, product_id, product_name, product_price, quantity
            FROM order_items
            WHERE order_id = $1;
        `;
    const itemsResult = await pool.query(itemsQuery, [orderId]);
    order.items = itemsResult.rows;

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details." });
  }
});

// ⭐ GET User Cart Items (Protected) - Updated table name
app.get("/api/cart", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    let cartResult = await pool.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [userId]
    );
    let cartId;

    if (cartResult.rows.length === 0) {
      const newCartResult = await pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
        [userId]
      );
      cartId = newCartResult.rows[0].id;
      return res
        .status(200)
        .json({ message: "Cart created and is empty.", items: [] });
    } else {
      cartId = cartResult.rows[0].id;
    }

    // ⭐ Changed 'products' to 'products_s' here
    const itemsResult = await pool.query(
      `SELECT
                ci.product_id,
                ci.quantity,
                p.name,
                p.price,
                p.image_url
            FROM cart_items ci
            JOIN products_s p ON ci.product_id = p.id
            WHERE ci.cart_id = $1`,
      [cartId]
    );

    res.status(200).json({ items: itemsResult.rows });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching cart." });
  }
});

// ⭐ Add Item to Cart (Protected)
app.post("/api/cart/add", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Product ID and a valid quantity are required." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    let cartResult = await client.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [userId]
    );
    let cartId;

    if (cartResult.rows.length === 0) {
      const newCartResult = await client.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
        [userId]
      );
      cartId = newCartResult.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    const existingItem = await client.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (existingItem.rows.length > 0) {
      await client.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3",
        [quantity, cartId, productId]
      );
      res.status(200).json({ message: "Product quantity updated in cart." });
    } else {
      await client.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
        [cartId, productId, quantity]
      );
      res.status(201).json({ message: "Product added to cart successfully." });
    }
    await client.query("COMMIT");
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ message: "Internal server error while adding to cart." });
  } finally {
    if (client) client.release();
  }
});

// Update Cart Item Quantity (Protected)
app.put("/api/cart/update-item", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Product ID and a valid quantity are required." });
  }

  try {
    const cartResult = await pool.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [userId]
    );
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }
    const cartId = cartResult.rows[0].id;

    const updateResult = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING id",
      [quantity, cartId, productId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    res
      .status(200)
      .json({ message: "Cart item quantity updated successfully." });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res
      .status(500)
      .json({ message: "Internal server error while updating cart item." });
  }
});

// Remove Item from Cart (Protected)
app.delete(
  "/api/cart/remove-item/:productId",
  authenticateToken,
  async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
      const cartResult = await pool.query(
        "SELECT id FROM carts WHERE user_id = $1",
        [userId]
      );
      if (cartResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Cart not found for this user." });
      }
      const cartId = cartResult.rows[0].id;

      const deleteResult = await pool.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING id",
        [cartId, productId]
      );

      if (deleteResult.rows.length === 0) {
        return res.status(404).json({ message: "Item not found in cart." });
      }

      res.status(200).json({ message: "Cart item removed successfully." });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res
        .status(500)
        .json({ message: "Internal server error while removing cart item." });
    }
  }
);

// --- API Endpoints ---
// Get all products from products_s
app.get("/api/products_s", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products_s ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single product by ID from products_s
app.get("/api/products_s/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products_s WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error(`Error fetching product with ID ${id}:`, err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ⭐ GET all blog posts
app.get("/api/blog_posts", async (req, res) => {
  try {
    // ⭐ Ensure 'status' and 'image_url' are selected
    const result = await pool.query(
      `SELECT id, title, excerpt, image_url, category, author, publish_date, read_time, status
             FROM blog_posts
             ORDER BY publish_date DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching blog posts." });
  }
});

// ⭐ GET a single blog post by ID
app.get("/api/blog_posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // ⭐ Ensure 'status' and 'image_url' are selected
    const result = await pool.query(
      `SELECT id, title, excerpt, content, image_url, category, author, publish_date, read_time, status
             FROM blog_posts
             WHERE id = $1`,
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Blog post not found." });
    }
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching blog post." });
  }
});

// POST endpoint for newsletter subscription and discount
app.post("/api/subscribe-discount", async (req, res) => {
  const { email } = req.body;

  // Server-side validation
  if (!email || !email.includes("@") || !email.includes(".")) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    // Check if email already exists
    const existingSubscriber = await pool.query(
      "SELECT * FROM subscribers WHERE email = $1",
      [email]
    );
    if (existingSubscriber.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "This email is already subscribed." });
    }

    // Generate a simple discount code
    const discountCode =
      "GOODSOIL" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Insert into database
    const insertResult = await pool.query(
      "INSERT INTO subscribers (email, discount_code) VALUES ($1, $2) RETURNING *",
      [email, discountCode]
    );

    // Send email with discount code
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (must be configured in your SMTP service)
      to: email, // Recipient address
      subject: "Your 20% Off Discount Code from The Good Soil Co.!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to The Good Soil Co. Family!</h2>
          <p>Thank you for subscribing to our newsletter. We're thrilled to have you!</p>
          <p>As a token of our appreciation, here's your exclusive <strong>20% OFF</strong> discount code for your first order:</p>
          <h3 style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; text-align: center; color: #333;">
            <strong>${discountCode}</strong>
          </h3>
          <p>Simply apply this code at checkout to enjoy your savings.</p>
          <p>Start growing better today by exploring our premium organic products:</p>
          <p>
            <a href="http://localhost:3000/productpage" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Shop Now</a>
          </p>
          <p>Happy Gardening!</p>
          <p>The Good Soil Co. Team</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8em; color: #666;">If you have any questions, feel free to contact us.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (mailError, info) => {
      if (mailError) {
        console.error("Error sending email:", mailError);
        // Even if email fails, we still want to confirm subscription if saved to DB
        return res.status(200).json({
          message:
            "Subscription successful, but failed to send discount email. Please contact support.",
        });
      }
      console.log("Email sent: %s", info.messageId);
      res.status(200).json({
        message: `Thank you for subscribing! Your 20% off code (${discountCode}) has been sent to your email.`,
      });
    });
  } catch (err) {
    console.error("Error in subscribe-discount endpoint:", err);
    if (err.code === "23505") {
      // PostgreSQL unique violation error code for duplicate email
      return res
        .status(409)
        .json({ message: "This email is already subscribed." });
    }
    res
      .status(500)
      .json({ error: "Internal Server Error during subscription." });
  }
});

// POST endpoint for garden plan submission
app.post("/api/garden-plan-submission", async (req, res) => {
  const {
    name,
    email,
    phone,
    space,
    grow,
    experience,
    specific_plants,
    seeds,
    fertilizer,
    mixes,
    pots,
    guidance,
  } = req.body;

  // Basic server-side validation
  if (!name || !email || !space || !grow || !experience) {
    return res
      .status(400)
      .json({ message: "Missing required garden plan fields." });
  }
  if (!email.includes("@") || !email.includes(".")) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    // Convert arrays to JSON strings for storage in TEXT columns
    const spaceJson = JSON.stringify(space);
    const growJson = JSON.stringify(grow);

    // Insert new garden plan into the database
    const insertResult = await pool.query(
      `INSERT INTO garden_plans (name, email, phone, space, grow, experience, specific_plants, seeds, fertilizer, mixes, pots, guidance)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        name,
        email,
        phone,
        spaceJson,
        growJson,
        experience,
        specific_plants,
        seeds,
        fertilizer,
        mixes,
        pots,
        guidance,
      ]
    );

    res.status(201).json({
      message: "Your garden plan has been submitted successfully!",
      planId: insertResult.rows[0].id,
    });
  } catch (err) {
    console.error("Error during garden plan submission:", err);
    res.status(500).json({
      message: "Internal Server Error during garden plan submission.",
    });
  }
});

// POST endpoint for contact form submission
app.post("/api/contact-message", async (req, res) => {
  const { name, email, phone, message } = req.body; // Added phone here

  // Basic server-side validation
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "All fields (Name, Email, Message) are required." });
  }
  if (!email.includes("@") || !email.includes(".")) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    // Insert contact message into the database
    // Added phone to the INSERT query
    const insertResult = await pool.query(
      "INSERT INTO contact_messages (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, phone, message] // Added phone to the values
    );

    // Send email to the company's designated email address
    const companyEmail = "teamtgsc@gmail.com"; // This is the company's email address
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your configured sender email (from .env)
      to: companyEmail, // Recipient: company's email
      subject: `New Contact Message from ${name} (${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p> 
          <p><strong>Message:</strong></p>
          <p style="background-color: #f0f0f0; padding: 15px; border-radius: 8px;">${message}</p>
          <p>This message was sent from your website's contact form.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8em; color: #666;">Please do not reply directly to this email. Respond to the user at ${email}.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (mailError, info) => {
      if (mailError) {
        console.error("Error sending contact email to company:", mailError);
        // Still send success to user if DB save was successful, but log email error
        return res.status(200).json({
          message:
            "Your message has been sent successfully, but there was an issue sending a copy to the company. We will follow up shortly.",
        });
      }
      console.log("Contact email sent to company: %s", info.messageId);
      res
        .status(201)
        .json({ message: "Your message has been sent successfully!" });
    });
  } catch (err) {
    console.error("Error during contact message submission:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error during message submission." });
  }
});

// POST endpoint for user registration
app.post("/api/register", async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  if (!fullName || !email || !phoneNumber || !password) {
    return res.status(400).json({
      message: "Full name, email, phone number, and password are required.",
    });
  }

  if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const existingUser = await pool.query(
      "SELECT id, email, phone_number FROM users WHERE email = $1 OR phone_number = $2",
      [email, phoneNumber]
    );

    if (existingUser.rows.length > 0) {
      const userExistsByEmail = existingUser.rows.some(
        (row) => row.email === email
      );
      const userExistsByPhone = existingUser.rows.some(
        (row) => row.phone_number === phoneNumber
      );

      if (userExistsByEmail) {
        return res.status(409).json({ message: "Email already registered." });
      }
      if (userExistsByPhone) {
        return res
          .status(409)
          .json({ message: "Phone number already registered." });
      }
    }

    const result = await pool.query(
      "INSERT INTO users (full_name, email, phone_number, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
      [fullName, email, phoneNumber, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully!",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration. Please try again later.",
    });
  }
});

// ⭐ UPDATED: User login endpoint to generate JWT
app.post("/api/login", async (req, res) => {
  const { loginIdentifier, password } = req.body;

  // Get IP address and User-Agent from the request
  const ipAddress = req.ip || req.connection.remoteAddress; // req.ip is more reliable if behind proxy
  const userAgent = req.headers["user-agent"];

  if (!loginIdentifier || !password) {
    // ⭐ Record failed attempt if validation fails early
    await pool.query(
      `INSERT INTO login_attempts (login_identifier, ip_address, user_agent, success, failure_reason)
         VALUES ($1, $2, $3, FALSE, $4)`,
      [loginIdentifier, ipAddress, userAgent, "missing_credentials"]
    );
    return res
      .status(400)
      .json({ message: "Email/Phone and password are required." });
  }

  let foundUser = null; // Initialize foundUser outside try block for broader scope

  try {
    let userQuery;
    const isEmail = loginIdentifier.includes("@");

    if (isEmail) {
      userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
        loginIdentifier,
      ]);
    } else {
      userQuery = await pool.query(
        "SELECT * FROM users WHERE phone_number = $1",
        [loginIdentifier]
      );
    }

    if (userQuery.rows.length === 0) {
      // ⭐ Record failed attempt: user not found
      await pool.query(
        `INSERT INTO login_attempts (login_identifier, ip_address, user_agent, success, failure_reason)
           VALUES ($1, $2, $3, FALSE, $4)`,
        [loginIdentifier, ipAddress, userAgent, "user_not_found"]
      );
      return res.status(401).json({ message: "Invalid credentials." });
    }

    foundUser = userQuery.rows[0]; // Assign foundUser here

    const passwordMatch = await bcrypt.compare(
      password,
      foundUser.password_hash
    );

    if (!passwordMatch) {
      // ⭐ Record failed attempt: invalid password
      await pool.query(
        `INSERT INTO login_attempts (user_id, login_identifier, ip_address, user_agent, success, failure_reason)
           VALUES ($1, $2, $3, $4, FALSE, $5)`,
        [
          foundUser.id,
          loginIdentifier,
          ipAddress,
          userAgent,
          "invalid_password",
        ]
      );
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // ⭐ Record successful login attempt
    await pool.query(
      `INSERT INTO login_attempts (user_id, login_identifier, ip_address, user_agent, success)
         VALUES ($1, $2, $3, $4, TRUE)`,
      [foundUser.id, loginIdentifier, ipAddress, userAgent]
    );

    // ⭐ Update last_login_at timestamp for successful login
    await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [
      foundUser.id,
    ]);

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: foundUser.id,
        fullName: foundUser.full_name,
        email: foundUser.email,
        phoneNumber: foundUser.phone_number,
      },
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    // ⭐ Record general server error login attempt
    const failureReason = error.message || "server_error";
    await pool.query(
      `INSERT INTO login_attempts (user_id, login_identifier, ip_address, user_agent, success, failure_reason)
         VALUES ($1, $2, $3, $4, FALSE, $5)`,
      [
        foundUser ? foundUser.id : null,
        loginIdentifier,
        ipAddress,
        userAgent,
        failureReason,
      ]
    );
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ⭐ UPDATED: Get User Profile Endpoint (uses req.userId from JWT)
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  const userId = req.user.id; // User ID obtained from the authenticated JWT token

  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone_number, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      // This is the specific case for "User not found."
      // It means the token was valid, but the user ID in the token doesn't exist in the database.
      return res.status(404).json({ message: "User not found." });
    }

    const user = result.rows[0];
    res.status(200).json({
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching profile." });
  }
});

// ⭐ NEW/UPDATED: Update User Profile Endpoint to save to database
app.put("/api/user/profile/update", authenticateToken, async (req, res) => {
  const userId = req.userId; // Get user ID from the authenticated JWT
  const { fullName, email, phoneNumber } = req.body; // Get updated data from the request body

  // Basic validation
  if (!fullName || !email || !phoneNumber) {
    return res
      .status(400)
      .json({ message: "Full name, email, and phone number are required." });
  }

  // Email format validation
  if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    // ⭐ Check for duplicate email or phone number being used by *another* user
    const existingUserWithEmailOrPhone = await pool.query(
      "SELECT id FROM users WHERE (email = $1 OR phone_number = $2) AND id != $3",
      [email, phoneNumber, userId] // Exclude the current user's ID
    );

    if (existingUserWithEmailOrPhone.rows.length > 0) {
      const isEmailTaken = existingUserWithEmailOrPhone.rows.some(
        (row) => row.email === email
      );
      const isPhoneTaken = existingUserWithEmailOrPhone.rows.some(
        (row) => row.phone_number === phoneNumber
      );

      if (isEmailTaken) {
        return res
          .status(409)
          .json({ message: "Email already in use by another account." });
      }
      if (isPhoneTaken) {
        return res
          .status(409)
          .json({ message: "Phone number already in use by another account." });
      }
    }

    // ⭐ Perform the update query
    const result = await pool.query(
      "UPDATE users SET full_name = $1, email = $2, phone_number = $3 WHERE id = $4 RETURNING id",
      [fullName, email, phoneNumber, userId]
    );

    // Check if the user was found and updated
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made." });
    }

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not update profile." });
  }
});

// ⭐ NEW: Forgot Password Request Endpoint
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // ⭐ CORRECTED LINE: Select 'id', 'full_name', AND 'email'
    const userResult = await pool.query(
      "SELECT id, full_name, email FROM users WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    // Important: Respond with a generic success message to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent to your inbox.",
      });
    }

    // Generate a secure, random token
    // ... (rest of your existing code for token generation and email sending)
    const resetToken = crypto.randomBytes(32).toString("hex"); // Plain token
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"); // Hashed token for DB
    const expiresAt = new Date(Date.now() + 3600000); // Token valid for 1 hour (3600000 ms)

    // Save the hashed token to the database
    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
      [user.id, tokenHash, expiresAt]
    );

    // Construct the reset URL for the frontend
    const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your sender email
      to: user.email, // This will now correctly have the email address
      subject: "Password Reset Request for The Good Soil Co.",
      html: `
        <p>Dear ${user.full_name || "User"},</p>
        <p>You have requested to reset your password for your account at The Good Soil Co.</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${resetUrl}">Reset Your Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The Good Soil Co. Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending reset password email:", error);
        // Do not return an error to the client, maintain generic success message
      } else {
        console.log("Password reset email sent:", info.response);
      }
    });

    res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent to your inbox.",
    });
  } catch (error) {
    console.error("Forgot password endpoint error:", error);
    res
      .status(500)
      .json({ message: "Server error during password reset request." });
  }
});

// ⭐ NEW: Reset Password Endpoint
app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find the token in the database
    const tokenResult = await pool.query(
      "SELECT user_id, expires_at FROM password_reset_tokens WHERE token_hash = $1",
      [tokenHash]
    );
    const storedToken = tokenResult.rows[0];

    if (!storedToken) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });
    }

    // Check if token has expired
    if (new Date() > new Date(storedToken.expires_at)) {
      // Delete expired token to prevent reuse and clean up
      await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [
        storedToken.user_id,
      ]);
      return res.status(400).json({
        message: "Password reset token has expired. Please request a new one.",
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the users table
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashedPassword,
      storedToken.user_id,
    ]);

    // ⭐ Invalidate all reset tokens for this user after successful reset
    // This is crucial to prevent replay attacks or use of old tokens
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [
      storedToken.user_id,
    ]);

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset password endpoint error:", error);
    res.status(500).json({ message: "Server error during password reset." });
  }
});

// Create Razorpay Order (Protected)
app.post("/api/create-razorpay-order", authenticateToken, async (req, res) => {
  const { amount, currency } = req.body;
  const userId = req.user.id; // Get userId from authenticated token

  if (!amount || !currency) {
    return res
      .status(400)
      .json({ message: "Amount and currency are required." });
  }

  // In a real application, you would use the Razorpay Node.js SDK here
  // const Razorpay = require('razorpay');
  // const instance = new Razorpay({
  //     key_id: process.env.RAZORPAY_KEY_ID,
  //     key_secret: process.env.RAZORPAY_KEY_SECRET,
  // });

  try {
    // ⭐ Mock Razorpay Order Creation (Replace with actual Razorpay SDK call)
    // Ensure amount is in paisa for Razorpay
    const orderAmountInPaisa = Math.round(amount * 100);

    const order = {
      id: `order_${Date.now()}_${userId}`, // Mock order ID, include userId for uniqueness
      entity: "order",
      amount: orderAmountInPaisa,
      currency: currency,
      receipt: `receipt_${userId}_${Date.now()}`,
      status: "created",
    };

    // Example of actual Razorpay SDK call (uncomment and configure when ready)
    /*
        const order = await instance.orders.create({
            amount: orderAmountInPaisa,
            currency,
            receipt: `receipt_${userId}_${Date.now()}`,
            notes: {
                userId: userId,
                // Add other relevant notes like cart items summary
            },
        });
        */

    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal server error creating order." });
  }
});

// Verify Razorpay Payment (Protected)
app.post(
  "/api/verify-razorpay-payment",
  authenticateToken,
  async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const userId = req.user.id;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        message: "Payment verification failed: Missing parameters.",
      });
    }

    // ⭐ In a real application, you MUST verify the signature using Razorpay's key_secret
    // const crypto = require('crypto');
    // const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    // shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    // const digest = shasum.digest('hex');

    // if (digest !== razorpay_signature) {
    //     console.error('Razorpay signature mismatch!');
    //     return res.status(400).json({ verified: false, message: 'Payment verification failed: Invalid signature.' });
    // }

    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN"); // Start transaction

      // 1. Get current cart items for this user to move to orders
      const cartResult = await client.query(
        "SELECT id FROM carts WHERE user_id = $1",
        [userId]
      );
      if (cartResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          verified: false,
          message: "Cart not found for order processing.",
        });
      }
      const cartId = cartResult.rows[0].id;

      const cartItemsResult = await client.query(
        `SELECT ci.product_id, ci.quantity, p.name, p.price
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = $1`,
        [cartId]
      );
      const cartItems = cartItemsResult.rows;

      if (cartItems.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          verified: false,
          message: "Cart is empty, cannot create order.",
        });
      }

      // Calculate total amount from cart items (server-side calculation for security)
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );

      // 2. Insert into `orders` table
      const orderInsertQuery = `
            INSERT INTO orders (
                user_id, total_amount, order_status, payment_status, payment_method, transaction_id,
                shipping_full_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
                razorpay_payment_id, razorpay_order_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id;
        `;
      // ⭐ IMPORTANT: You need to retrieve shipping information here.
      // This usually comes from a separate step on the checkout page, or from user's default address.
      // For now, I'll use placeholders. You MUST replace these with actual data.
      const mockShippingInfo = {
        fullName: "Default User",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA",
      };

      const newOrderResult = await client.query(orderInsertQuery, [
        userId,
        totalAmount,
        "Processing", // Initial status
        "Paid", // Payment status is Paid after verification
        "Razorpay",
        razorpay_payment_id, // Using payment ID as transaction ID for simplicity
        mockShippingInfo.fullName,
        mockShippingInfo.address,
        mockShippingInfo.city,
        mockShippingInfo.state,
        mockShippingInfo.zip,
        mockShippingInfo.country,
        razorpay_payment_id,
        razorpay_order_id,
      ]);
      const newOrderId = newOrderResult.rows[0].id;

      // 3. Insert items into `order_items` table
      for (const item of cartItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
                 VALUES ($1, $2, $3, $4, $5)`,
          [
            newOrderId,
            item.product_id,
            item.name,
            parseFloat(item.price),
            item.quantity,
          ]
        );
      }

      // 4. Clear the user's cart after successful order creation
      await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

      await client.query("COMMIT"); // Commit transaction
      res.status(200).json({
        verified: true,
        message: "Payment verified and order placed!",
        orderId: newOrderId,
      });
    } catch (error) {
      if (client) await client.query("ROLLBACK"); // Rollback on error
      console.error(
        "Error during Razorpay payment verification/order processing:",
        error
      );
      res.status(500).json({
        verified: false,
        message: "Internal server error during payment verification.",
      });
    } finally {
      if (client) client.release();
    }
  }
);

// Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


// Your app.listen() call now specifies the host '0.0.0.0'
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
