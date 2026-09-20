// Margdarshak AI - Interactive AI Mock Interview Question Bank
// Authentic, randomized questions with hints, grading rubrics, and ideal golden responses
// Tailored for TCS, Amazon, Infosys, Flipkart, Zoho, FinTech, and Universal Engineering Roles

const interviewQuestionBank = {
  // 1. TCS Prime & Digital
  "tcs-prime": [
    {
      id: "tcs-intro",
      type: "intro",
      category: "Self Introduction & Alignment",
      question: "Welcome to the TCS Prime Technical Assessment. Let's begin with your professional narrative. Tell me about yourself, your core engineering strengths, and the most complex software project you've built.",
      hint: "Use the Present-Past-Future framework: current status & major tech stack, 1 deep-dive project with quantifiable impact, and why TCS Prime's digital scale excites you.",
      keywords: ["engineering", "data structures", "project", "architecture", "impact", "problem solving", "java", "python", "git"],
      idealAnswer: "Good morning. I am a final-year Computer Science engineer passionate about scalable backend systems and algorithmic efficiency. Over the past three years, I've solved over 350 algorithmic problems on LeetCode with strong focus on graphs, trees, and dynamic programming. Recently, I architected a distributed URL shortening service using Java Spring Boot, Redis caching, and PostgreSQL, handling 1,500 requests/second while reducing database read latency by 68%. I follow clean code principles, version control workflows, and unit testing. I am specifically keen on joining the TCS Prime cadre because of the opportunity to work on large-scale architectural modernization for global financial and telecom enterprise clients.",
      mistakesToAvoid: "Avoid narrating your entire 10th/12th school history, memorized generic hobby lists, or saying 'I am a fast learner' without concrete project evidence."
    },
    {
      id: "tcs-ds-1",
      type: "technical",
      category: "Data Structures & Complexity",
      question: "How would you detect and remove a cycle in a singly linked list in O(n) time and O(1) auxiliary space? Walk me through Floyd's Cycle Detection Algorithm.",
      hint: "Think about two pointers: a slow pointer moving 1 step at a time and a fast pointer moving 2 steps. What happens when they collide?",
      keywords: ["floyd", "slow pointer", "fast pointer", "collision", "linked list", "cycle", "loop", "o(1) space", "tortoise and hare"],
      idealAnswer: "To detect a cycle in O(n) time and O(1) space, we use Floyd's Cycle Detection (Tortoise and Hare algorithm). We initialize two pointers, `slow` and `fast`, at the head. `slow` advances 1 node per iteration while `fast` advances 2. If `fast` or `fast.next` reaches null, no cycle exists. If they meet, a cycle is confirmed. To find the starting node of the loop and remove it, we reset `slow` to the head while keeping `fast` at the meeting point. Moving both pointers 1 step at a time, their next meeting point is mathematically guaranteed to be the cycle start. To remove the cycle, we track the predecessor node and set its next pointer to null.",
      mistakesToAvoid: "Do not suggest using a Hash Set or Map because that consumes O(n) auxiliary space violating the space constraint."
    },
    {
      id: "tcs-java-1",
      type: "technical",
      category: "Language Internals & Memory",
      question: "In Java, what is the exact difference between the String Pool, heap allocation, and how does `intern()` work? Also explain why Strings are designed to be immutable.",
      hint: "Consider security, thread-safety, caching, and hashcode stability when explaining immutability.",
      keywords: ["string pool", "heap", "immutable", "intern", "thread-safe", "hashcode", "security", "memory optimization"],
      idealAnswer: "In Java, String literals are stored in the String Constant Pool inside heap memory. When a literal is created (e.g. String s = 'TCS'), JVM first checks the pool. If present, it returns the reference; otherwise, it creates a new object in the pool. When using `new String('TCS')`, it forcefully creates an object on the general heap plus ensures the literal is pooled. The `intern()` method allows manual retrieval or insertion of the literal reference from the pool. Strings are immutable for 4 key architectural reasons: 1) Security: Sensitive data like database URLs and passwords cannot be mutated in-flight. 2) Thread Safety: Multiple threads can safely read Strings concurrently without synchronization. 3) Caching: The hashcode is cached at creation, making HashMap lookups instantaneous. 4) Memory Efficiency via String Pool sharing.",
      mistakesToAvoid: "Failing to mention thread-safety or hashcode caching in HashMaps when discussing immutability."
    },
    {
      id: "tcs-dbms-1",
      type: "technical",
      category: "Database & Performance",
      question: "What are the ACID properties in database transactions? Explain what dirty reads and phantom reads are, and how transaction isolation levels mitigate them.",
      hint: "Think about Atomicity (all or nothing), Consistency, Isolation, and Durability. Isolation levels range from Read Uncommitted to Serializable.",
      keywords: ["acid", "atomicity", "consistency", "isolation", "durability", "dirty read", "phantom read", "repeatable read", "serializable"],
      idealAnswer: "ACID guarantees transactional integrity. Atomicity ensures all-or-nothing execution. Consistency preserves database integrity constraints. Isolation ensures concurrent transactions execute independently without interference. Durability guarantees committed transactions survive system crashes via write-ahead logging (WAL). A Dirty Read occurs when Transaction A reads uncommitted modifications made by Transaction B, which is subsequently rolled back. A Phantom Read occurs when Transaction A executes a range query, Transaction B inserts new rows matching the predicate and commits, causing Transaction A to observe phantom rows upon re-query. These anomalies are prevented by adjusting Isolation Levels: Read Committed prevents Dirty Reads, Repeatable Read prevents Non-repeatable Reads, and Serializable provides absolute isolation.",
      mistakesToAvoid: "Only defining the acronym ACID without explaining the transactional anomalies (Dirty Read, Phantom Read) or isolation trade-offs."
    },
    {
      id: "tcs-sys-1",
      type: "system_design",
      category: "System Design & Scalability",
      question: "Suppose TCS is building an online attendance and exam verification portal for 10 Lakh students simultaneously submitting responses. How would you design the architecture to prevent database bottleneck?",
      hint: "Consider caching (Redis), message queues (Kafka/RabbitMQ) for asynchronous writes, load balancing, and read-write database replicas.",
      keywords: ["load balancer", "redis", "message queue", "kafka", "asynchronous", "caching", "database sharding", "microservices", "horizontal scaling"],
      idealAnswer: "To handle 10 Lakh simultaneous submissions without overwhelming the database, I would employ an asynchronous, event-driven decoupled architecture: 1) Use an Application Load Balancer (Nginx/AWS ALB) to distribute incoming traffic across auto-scaled stateless application server instances. 2) Rather than performing synchronous write operations directly to PostgreSQL/MySQL, push the submitted exam answers into a partitioned distributed message queue like Apache Kafka or AWS SQS. 3) Worker services consume messages in controlled batches and persist records into the primary database, completely shielding it from sudden traffic spikes. 4) Use Redis in-memory cache for fast session verification and student authentication tokens. 5) Separate read queries using Read Replicas with database connection pooling (HikariCP).",
      mistakesToAvoid: "Suggesting direct synchronous database writes from the client, which will cause connection pool starvation and 504 gateway timeouts."
    },
    {
      id: "tcs-hr-1",
      type: "behavioral",
      category: "Behavioral & Conflict Resolution",
      question: "Tell me about a time during a college project or hackathon when you had a strong technical disagreement with a teammate. How did you resolve it?",
      hint: "Use the STAR method (Situation, Task, Action, Result). Focus on objective data, benchmarking, and maintaining team harmony.",
      keywords: ["star method", "disagreement", "teamwork", "data-driven", "resolution", "communication", "result"],
      idealAnswer: "In our final year capstone project, our team of four was split on whether to use MongoDB or PostgreSQL for an e-commerce platform. My teammate wanted MongoDB for quick prototyping, while I advocated PostgreSQL because our inventory and transactions required strict ACID compliance and relational integrity. Instead of arguing opinion, I set up a quick 1-hour benchmark testing 10,000 concurrent cart checkouts and showed that race conditions in stock updates could lead to overselling without relational row-level locking. Seeing the empirical test result, the team agreed on PostgreSQL for the core transactional engine while using MongoDB for product catalog reviews. We delivered the project on time and scored the highest distinction in our batch.",
      mistakesToAvoid: "Saying 'I never had any disagreements' or sounding defensive and dismissive of teammates."
    }
  ],

  // 2. Amazon SDE-1
  "amzn-sde1": [
    {
      id: "amzn-intro",
      type: "intro",
      category: "Leadership Principles & Intro",
      question: "Hello! Welcome to the Amazon Software Development Engineer interview. Introduce yourself, highlighting a project where you displayed Customer Obsession or Bias for Action.",
      hint: "Ground your pitch in Amazon Leadership Principles. Quantify latency, throughput, or user customer satisfaction improvements.",
      keywords: ["customer obsession", "bias for action", "ownership", "latency", "scale", "aws", "software engineer", "algorithms"],
      idealAnswer: "Hi, I am a software engineer focused on distributed backend architectures. During my recent work, I noticed students from remote areas struggled to load course materials due to spotty 2G/3G connections. Embodying Customer Obsession, I took ownership to redesign our media delivery pipeline, implementing aggressive WebP image compression, client-side indexedDB caching, and CDN edge caching. This slashed initial page load time by 72% from 6.8s to 1.9s and enabled offline study. I've solved 400+ DSA problems with emphasis on graph theory and dynamic programming. I am eager to contribute to Amazon's culture of building scalable, customer-first software.",
      mistakesToAvoid: "Failing to weave Amazon's Leadership Principles into your technical achievements."
    },
    {
      id: "amzn-dsa-1",
      type: "technical",
      category: "Algorithms & Trees",
      question: "Given a binary tree, how would you find the Lowest Common Ancestor (LCA) of two given nodes p and q? What is the time and space complexity?",
      hint: "If the current node is null, return null. If the current node matches p or q, return the current node. Recurse left and right. What does it mean if both return non-null?",
      keywords: ["lowest common ancestor", "binary tree", "recursion", "depth first search", "o(n) time", "o(h) space", "divide and conquer"],
      idealAnswer: "We can solve LCA in O(N) time and O(H) recursion stack space using Depth-First Search. In our recursive function: 1) Base case: If current node is null or equals either p or q, we return root. 2) We recursively search the left subtree: `left = lowestCommonAncestor(root.left, p, q)` and right subtree: `right = lowestCommonAncestor(root.right, p, q)`. 3) If both `left` and `right` return non-null, it indicates p and q reside in different subtrees of the current node, making root their Lowest Common Ancestor. 4) If only one subtree returns non-null, we propagate that non-null node upwards.",
      mistakesToAvoid: "Assuming the binary tree is a Binary Search Tree (BST) without confirming with the interviewer. This approach works for general binary trees."
    },
    {
      id: "amzn-lld-1",
      type: "system_design",
      category: "Low Level Design (LLD)",
      question: "Design an in-memory Parking Lot system following SOLID principles. What classes, interfaces, and design patterns would you use?",
      hint: "Think about Vehicle (Car, Bike, Truck), ParkingSpot (Compact, Large, Handicapped), ParkingFloor, and ParkingLot singleton with Strategy pattern for slot allocation.",
      keywords: ["solid", "singleton", "strategy pattern", "factory pattern", "object oriented design", "encapsulation", "polymorphism"],
      idealAnswer: "For a modular SOLID design: 1) Entities: Abstract class `Vehicle` with concrete subclasses `Motorcycle`, `Car`, `Truck`. Enum `VehicleType`. 2) Parking Space: `ParkingSpot` base class with subclasses `CompactSpot`, `LargeSpot`, `ElectricSpot`, tracking availability boolean and vehicle reference. 3) Strategy Pattern: An interface `ParkingStrategy` with implementations like `NearestToEntryStrategy` and `FarthestSlotStrategy` to allow dynamic slot assignment. 4) Singleton Pattern: `ParkingLot` class holding a list of `ParkingFloor` instances. 5) Factory Pattern: `VehicleFactory` and `TicketFactory` to create parking passes with timestamps and calculate fees dynamically based on duration and vehicle size.",
      mistakesToAvoid: "Dumping everything into one gigantic monolithic class violating the Single Responsibility Principle."
    },
    {
      id: "amzn-behavioral-1",
      type: "behavioral",
      category: "Amazon Leadership Principles",
      question: "Give me an example of a time when you realized you had made a mistake in production or in a submitted assignment. How did you handle it and what did you learn?",
      hint: "Amazon values Ownership and Earns Trust. Never blame others. State how you owned the mistake, mitigated immediate damage, and put automated guardrails in place.",
      keywords: ["ownership", "earns trust", "production bug", "mitigation", "post-mortem", "root cause analysis", "prevention"],
      idealAnswer: "During our college fest registration portal rollout, I deployed a change to the user authentication controller without thorough regression testing on edge cases. A missing null check on the phone number field caused the registration API to return 500 errors for students registering with Google OAuth without phone numbers. Within 10 minutes of deployment, monitoring alerts pinged me. I immediately owned the issue, rolled back the commit to the previous stable release within 3 minutes, and posted a transparent update in our team channel. Afterwards, I wrote unit and integration tests covering null parameters and configured a pre-commit GitHub Actions CI pipeline that blocks any deployment if test coverage drops below 85%.",
      mistakesToAvoid: "Claiming you've never made a mistake or blaming your teammate for not catching it."
    }
  ],

  // 3. Flipkart SDE-1 / UI Engineer
  "flipkart-sde1": [
    {
      id: "fk-intro",
      type: "intro",
      category: "E-Commerce Systems Intro",
      question: "Welcome to Flipkart. Tell us about yourself and what drives your interest in engineering high-concurrency e-commerce systems.",
      hint: "Focus on web performance, latency, microservices, and handling sudden shopping spikes like Big Billion Days.",
      keywords: ["flipkart", "concurrency", "big billion days", "frontend", "backend", "scalability", "redis", "javascript"],
      idealAnswer: "Hello! I am a full-stack software engineer with deep interest in resilient web applications. Having followed Flipkart's engineering blogs on flash-sale architectures and FDP (Flipkart Data Platform), I love solving latency and high concurrency challenges. In my recent project, I built a collaborative shopping cart with real-time inventory locking using WebSockets and Redis atomic transactions, preventing double-allocation of limited inventory items. I thrive on debugging performance bottlenecks, whether it is database indexing or frontend bundle size reduction.",
      mistakesToAvoid: "Treating Flipkart as just another job without referencing their engineering scale."
    },
    {
      id: "fk-tech-1",
      type: "technical",
      category: "Concurrency & Caching",
      question: "During a Big Billion Days flash sale, 50,000 customers click 'Buy Now' on a smartphone with only 100 units in stock. How do you prevent overselling while keeping response times under 50ms?",
      hint: "Consider Redis atomic `DECR`, distributed locking (Redlock), optimistic vs pessimistic locking, and message queues.",
      keywords: ["redis", "atomic operation", "decr", "distributed lock", "concurrency", "overselling", "kafka", "race condition"],
      idealAnswer: "Direct database updates with `SELECT ... FOR UPDATE` will lock rows and trigger database connection exhaustion under 50,000 requests. The battle-tested approach is: 1) Cache the available inventory count (100) in an in-memory Redis cluster. 2) When a user clicks 'Buy Now', execute an atomic Redis command `DECR stock_count` or an atomic Lua script that checks `if stock > 0 then stock = stock - 1 return true`. 3) Since Redis is single-threaded and executes atomic commands in memory, it completes in <2ms without race conditions. If `DECR` returns < 0, the request is immediately rejected with 'Out of Stock'. 4) For the successful 100 requests, push an order creation event to an Apache Kafka topic for asynchronous payment and order processing, guaranteeing zero overselling and ultra-low latency.",
      mistakesToAvoid: "Suggesting relational database row-level locking at 50,000 concurrent RPS."
    },
    {
      id: "fk-ui-1",
      type: "technical",
      category: "Frontend Web Performance",
      question: "How does the browser rendering engine work (Critical Rendering Path)? How would you optimize Core Web Vitals (LCP, FID/INP, CLS) on an e-commerce product listing page?",
      hint: "Explain HTML parsing -> DOM tree -> CSSOM -> Render Tree -> Layout -> Paint -> Composite. Discuss image optimization, lazy loading, and dimension reservation.",
      keywords: ["critical rendering path", "dom", "cssom", "layout", "paint", "lcp", "cls", "inp", "lazy loading", "code splitting"],
      idealAnswer: "The Critical Rendering Path consists of: 1) HTML parsed into DOM tree. 2) CSS parsed into CSSOM tree. 3) Combined into Render Tree containing only visible elements. 4) Layout calculates geometry and positions. 5) Paint converts pixels to raster layers. 6) Composite combines layers onto the screen. To optimize Core Web Vitals on an e-commerce page: 1) Largest Contentful Paint (LCP): Preload hero banner/product images using `<link rel='preload'>`, use next-gen WebP/AVIF formats, and serve via CDN. 2) Cumulative Layout Shift (CLS): Explicitly define `width` and `height` aspect-ratio on all product thumbnail images and skeleton placeholders so the page doesn't jump as items load. 3) Interaction to Next Paint (INP): Offload heavy JavaScript filtering to Web Workers, use debounce/throttle on search filters, and break long tasks using `requestIdleCallback`.",
      mistakesToAvoid: "Forgetting to mention explicit image aspect ratios when explaining Cumulative Layout Shift."
    }
  ],

  // 4. Zoho Member Technical Staff
  "zoho-mts": [
    {
      id: "zoho-intro",
      type: "intro",
      category: "Frugal Engineering & Clean Code",
      question: "Welcome to Zoho. We build everything from scratch without heavy third-party bloat. Tell us about your coding background and your comfort working with core data structures and raw algorithms.",
      hint: "Zoho values candidates who understand memory management, pointer manipulation, and writing clean algorithms without relying on NPM or external libraries.",
      keywords: ["zoho", "data structures", "clean code", "java", "c++", "memory management", "algorithms", "problem solving"],
      idealAnswer: "Good morning. I pride myself on writing clean, efficient, foundational code without excessive dependencies. I enjoy working directly with core language features in C++ and Java, having implemented custom hash maps, linked lists, and sorting algorithms from scratch to understand collision handling and memory layouts. In college, I developed a lightweight text search engine that parses and indexes documents using a Trie and inverted index without using external search libraries. I admire Zoho's engineering culture of independence, self-reliance, and deep product craftsmanship.",
      mistakesToAvoid: "Boasting about installing dozens of npm libraries or heavy frameworks; Zoho prides itself on in-house engineering."
    },
    {
      id: "zoho-algo-1",
      type: "technical",
      category: "Pure Algorithms & Matrix",
      question: "Given an N x N 2D matrix, write an algorithm to rotate it 90 degrees clockwise in-place without using extra memory matrix (O(1) auxiliary space).",
      hint: "Remember the two-step trick: First transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row horizontally.",
      keywords: ["matrix", "transpose", "reverse", "in-place", "o(1) space", "rotate 90 degrees", "two pointer"],
      idealAnswer: "To rotate an N x N matrix 90 degrees clockwise in-place: Step 1: Transpose the matrix along the main diagonal by iterating `i` from 0 to N-1 and `j` from `i+1` to N-1, swapping `matrix[i][j]` with `matrix[j][i]`. Step 2: Reverse every individual row horizontally using two pointers (`left = 0`, `right = N - 1`). Swapping elements inwards until pointers cross. This achieves an exact 90-degree clockwise rotation with O(N^2) time and strictly O(1) auxiliary space.",
      mistakesToAvoid: "Allocating a second matrix of size N x N; that fails the in-place constraint."
    }
  ],

  // 5. Universal Frontend (React / Next.js)
  "universal-frontend": [
    {
      id: "fe-intro",
      type: "intro",
      category: "Frontend Specialization",
      question: "Hello! Tell me about your journey in modern frontend development, your proficiency in React/TypeScript, and your approach to building responsive, accessible web applications.",
      hint: "Mention modern hooks, state management, component architecture, responsive design, and web performance profiling.",
      keywords: ["react", "typescript", "hooks", "responsive", "accessibility", "state management", "performance", "tailwind"],
      idealAnswer: "Hello! I am a frontend engineer specializing in React, TypeScript, and modern responsive design. I focus on building performant, accessible web interfaces that deliver intuitive user experiences across desktop and mobile devices. In my recent projects, I implemented custom hooks for data fetching with caching, decoupled state management using Zustand, and applied atomic design principles. I pay careful attention to accessibility standards (WCAG 2.1), semantic HTML, and bundle size reduction through dynamic imports and code-splitting.",
      mistakesToAvoid: "Talking only about styling without addressing state management, performance, or TypeScript."
    },
    {
      id: "fe-react-1",
      type: "technical",
      category: "React Internals & Reconciliation",
      question: "How does React's Virtual DOM and Fiber reconciliation algorithm work? Why is using an array index as a `key` prop considered an anti-pattern in dynamic lists?",
      hint: "Explain how React computes diffs. When array elements are inserted, deleted, or reordered, how do index keys mislead React's reconciler?",
      keywords: ["virtual dom", "fiber", "reconciliation", "diffing", "key prop", "unnecessary re-renders", "component state corruption"],
      idealAnswer: "React's Virtual DOM is an in-memory lightweight representation of the real DOM. When component state changes, React creates a new VDOM tree and compares it with the previous snapshot using its Fiber reconciler. Fiber breaks rendering work into incremental units, allowing browser priority scheduling. The `key` prop gives elements a stable identity across renders. Using an array index as a key is an anti-pattern when lists can be reordered, filtered, or prepended: React assumes the element at index 0 is unchanged, failing to unmount or re-render child component state correctly, leading to UI glitches, incorrect form values, and broken animations. Stable unique IDs (like database UUIDs) should always be used.",
      mistakesToAvoid: "Claiming that index keys are always fine as long as the page compiles."
    }
  ],

  // 6. Data Analyst / FinTech Data Specialist
  "tcs-data-analyst": [
    {
      id: "data-intro",
      type: "intro",
      category: "Analytics & Problem Solving",
      question: "Introduce yourself and explain how you leverage SQL and Python to extract actionable business insights from raw, messy datasets.",
      hint: "Mention data cleaning, exploratory data analysis (EDA), window functions, visualization (PowerBI/Tableau), and translating numbers into business decisions.",
      keywords: ["sql", "python", "pandas", "window functions", "data cleaning", "power bi", "business insights", "eda"],
      idealAnswer: "Hello! I am a Data Analyst skilled in SQL, Python (Pandas, NumPy), and business intelligence dashboards. I enjoy bridging the gap between raw data tables and strategic business decisions. In a recent project analyzing retail customer churn, I cleaned 200,000 transaction records, built SQL queries utilizing window functions (`ROW_NUMBER`, `DENSE_RANK`, `LAG/LEAD`), and identified that customers with more than 3 customer support complaints within 30 days had a 74% higher churn probability. By creating an automated PowerBI alert dashboard, we enabled the retention team to intervene proactively.",
      mistakesToAvoid: "Focusing purely on academic math without showing how you solved an actual business problem."
    },
    {
      id: "data-sql-1",
      type: "technical",
      category: "Advanced SQL & Window Functions",
      question: "Write an SQL query to find the 2nd highest salary from an Employee table without using `LIMIT` or `OFFSET`. Then explain the difference between `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()`.",
      hint: "Use `DENSE_RANK() OVER (ORDER BY salary DESC)` inside a Common Table Expression (CTE) or subquery.",
      keywords: ["sql", "window functions", "dense_rank", "rank", "row_number", "cte", "second highest salary", "subquery"],
      idealAnswer: "To find the 2nd highest salary robustly handling duplicates without LIMIT/OFFSET: `WITH RankedSalaries AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_pos FROM Employee) SELECT salary FROM RankedSalaries WHERE rank_pos = 2;`. Differences: 1) `ROW_NUMBER()` assigns sequential consecutive integers (1, 2, 3, 4) regardless of ties. 2) `RANK()` assigns identical ranks to ties but skips subsequent numbers (1, 2, 2, 4). 3) `DENSE_RANK()` assigns identical ranks to ties without skipping subsequent numbers (1, 2, 2, 3). For salary rankings, `DENSE_RANK` is essential to prevent skipping the second distinct salary if multiple employees share the top salary.",
      mistakesToAvoid: "Suggesting `MAX(salary) WHERE salary < (SELECT MAX(salary))` without acknowledging how window functions generalize to the N-th highest salary."
    }
  ]
};

// Fallback universal question pool to assemble 5-7 questions for ANY company/role
const universalQuestions = [
  {
    id: "univ-tell-me",
    type: "intro",
    category: "Professional Elevator Pitch",
    question: "Walk me through your resume: Tell me about yourself, your educational background, and why you are targeting this specific role.",
    hint: "Structure your response into 3 parts: Who you are, your top technical achievement, and why this specific role matches your trajectory.",
    keywords: ["education", "skills", "projects", "achievement", "passion", "career"],
    idealAnswer: "Hello, I am a dedicated engineering student who has spent the last two years developing a strong foundation in computer science and software development. I have built full-stack applications with responsive frontends and secure backends, practicing test-driven development and clean code. I am eager to contribute my energy, quick learning ability, and problem-solving skills to this role while learning from senior architects.",
    mistakesToAvoid: "Speaking without structure or reciting facts already obvious on the top of your resume."
  },
  {
    id: "univ-dsa",
    type: "technical",
    category: "Algorithmic Problem Solving",
    question: "Explain the difference between Time Complexity and Space Complexity. What does Amortized O(1) time complexity mean in the context of dynamic array resizing (like ArrayList or Python list)?",
    hint: "Explain geometric doubling: When capacity is reached, allocate double size, copy elements. The expensive copy happens rarely.",
    keywords: ["time complexity", "space complexity", "amortized", "dynamic array", "resizing", "big-o", "geometric progression"],
    idealAnswer: "Time complexity measures the rate of growth of execution time relative to input size N, while space complexity measures auxiliary memory used. Amortized O(1) means that while individual operations may occasionally be expensive (O(N)), the average cost per operation over a long sequence of operations is constant O(1). In dynamic arrays (like Java's ArrayList), resizing doubles the internal capacity. Copying N elements takes O(N), but this only occurs after N insertions. Dividing total copy operations by N yields an amortized constant cost of O(1) per insert.",
    mistakesToAvoid: "Confusing worst-case single operation cost with average amortized cost."
  },
  {
    id: "univ-oops",
    type: "technical",
    category: "Object-Oriented Programming (OOP)",
    question: "What are the 4 fundamental pillars of Object-Oriented Programming? Give a concrete real-world code scenario demonstrating Polymorphism.",
    hint: "Encapsulation, Abstraction, Inheritance, Polymorphism. Explain Method Overriding (runtime) vs Method Overloading (compile-time).",
    keywords: ["encapsulation", "abstraction", "inheritance", "polymorphism", "runtime", "overriding", "interface"],
    idealAnswer: "The 4 pillars are: 1) Encapsulation: Bundling data and methods that operate on that data into a single unit and restricting direct access via getters/setters. 2) Abstraction: Hiding internal implementation details and showing only necessary functionality via abstract classes and interfaces. 3) Inheritance: Deriving new classes from existing classes to reuse code. 4) Polymorphism: The ability of an object to take many forms. A real-world example is a Payment Processing system where an interface `PaymentMethod` defines a method `processPayment(double amount)`. Subclasses `CreditCardPayment`, `UPIPayment`, and `NetBankingPayment` override this method. The checkout controller simply calls `paymentMethod.processPayment()` at runtime without needing to know which specific payment gateway is executing.",
    mistakesToAvoid: "Defining the terms mechanically without providing a clean, relatable code example."
  },
  {
    id: "univ-project",
    type: "technical",
    category: "Project Deep Dive & Architecture",
    question: "Pick one major technical project from your resume. What was the most challenging technical roadblock you encountered, how did you diagnose it, and how did you resolve it?",
    hint: "Use STAR (Situation, Task, Action, Result). State the symptom, the debugging tool used (logs, profiler, network tab), and the exact fix.",
    keywords: ["project", "architecture", "debugging", "challenge", "optimization", "resolution", "logs", "metrics"],
    idealAnswer: "In our final year healthcare appointment platform, we faced a critical issue where concurrent users booking the same doctor slot triggered double-bookings. Initially, I suspected frontend lag, but looking at server logs and database query timestamps, I realized our API had a classic read-modify-write race condition. To fix this, I implemented an optimistic locking mechanism using a version column in our PostgreSQL database alongside a Redis distributed lock for checkout sessions. This eliminated double-bookings completely while keeping booking response times under 80ms.",
    mistakesToAvoid: "Describing a team communication issue instead of a deep technical roadblock."
  },
  {
    id: "univ-behavioral",
    type: "behavioral",
    category: "Adaptability & Pressure",
    question: "Describe a situation where a project deadline was suddenly moved forward or specifications changed drastically. How did you prioritize tasks and deliver under pressure?",
    hint: "Highlight calm prioritization, breaking down Must-Haves vs Nice-to-Haves, clear communication, and delivering a functional core on time.",
    keywords: ["pressure", "deadline", "prioritization", "mvp", "communication", "adaptability", "execution"],
    idealAnswer: "During a 24-hour national hackathon, our mentor recommended pivoting our core algorithm 8 hours before the final submission to address a stricter privacy constraint. Instead of panicking, our team held a 10-minute standup where we decoupled the feature set into 'Must-Have Core MVP' and 'Nice-to-Have Aesthetics'. I took responsibility for refactoring the data anonymization module while my teammate adjusted the frontend forms. By focusing ruthlessly on the critical path, we finished 45 minutes ahead of the final evaluation and won 2nd runner-up.",
    mistakesToAvoid: "Saying you worked all night without sleeping, as interviewers prioritize sustainable engineering and prioritization over chaotic burnout."
  }
];

// Function to dynamically build a tailored 5-7 question session for any selected role
function generateInterviewQuestions(roleId, companyName, roleTitle) {
  let questions = [];
  
  // 1. Check if specific question bank exists
  if (interviewQuestionBank[roleId]) {
    questions = [...interviewQuestionBank[roleId]];
  } else {
    // Check if partial matching
    const matchingKey = Object.keys(interviewQuestionBank).find(k => roleId.includes(k) || k.includes(roleId));
    if (matchingKey) {
      questions = [...interviewQuestionBank[matchingKey]];
    }
  }

  // 2. Ensure we have at least 5-7 questions by blending universal questions
  if (questions.length < 5) {
    universalQuestions.forEach(uq => {
      if (!questions.some(q => q.category === uq.category || q.id === uq.id)) {
        questions.push(uq);
      }
    });
  }

  // 3. Customize question #1 specifically with company & role name
  if (questions.length > 0 && questions[0].type === "intro") {
    questions[0].question = `Welcome to the ${companyName || 'Technical'} panel interview for the ${roleTitle || 'Software Engineer'} role. To begin, tell us about yourself, your core technical strengths, and what prepared you to excel in this role.`;
  }

  // Shuffle middle questions slightly so every interview session feels fresh and randomized
  const intro = questions[0];
  const others = questions.slice(1);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }

  // Return exactly 5 to 6 balanced questions
  return [intro, ...others].slice(0, 6);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interviewQuestionBank, universalQuestions, generateInterviewQuestions };
} else if (typeof window !== 'undefined') {
  window.interviewQuestionBank = interviewQuestionBank;
  window.universalQuestions = universalQuestions;
  window.generateInterviewQuestions = generateInterviewQuestions;
}
