// Margdarshak AI - Comprehensive All-India Companies & Roles Database
// 65+ Major Indian Tech, IT Services, Unicorns, Startups & MNCs

const companiesData = [
  // 1. Top Indian IT Giants
  {
    id: "tcs",
    name: "Tata Consultancy Services (TCS)",
    tier: "IT Services Titan",
    location: "Pan-India (Mumbai, Pune, Bengaluru, Chennai, Hyderabad, Delhi NCR, Kolkata)",
    roles: [
      {
        roleId: "tcs-prime",
        title: "Systems Engineer (Prime / 9 LPA)",
        category: "Software Development",
        package: "₹9.0 - ₹11.5 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Java", "Python", "System Design Basics", "SQL & DBMS", "Git", "Clean Code"],
        bonusSkills: ["Cloud (AWS/Azure)", "Docker", "Microservices", "Spring Boot", "React.js"],
        typicalQuestions: 6,
        description: "High-tier engineering role at TCS requiring strong algorithmic problem solving, clean coding and architectural fundamentals."
      },
      {
        roleId: "tcs-digital",
        title: "Digital Innovator (7 LPA)",
        category: "Digital Technologies",
        package: "₹7.0 - ₹8.5 LPA",
        requiredSkills: ["Java", "Python", "Data Structures", "SQL", "OOPs", "Web Development Basics", "REST APIs"],
        bonusSkills: ["Machine Learning Basics", "Node.js", "Angular", "Linux Commands"],
        typicalQuestions: 5,
        description: "Specialized engineering cadre focused on next-gen digital initiatives, IoT, Analytics and Cloud solutions."
      },
      {
        roleId: "tcs-ninja",
        title: "Assistant System Engineer (Ninja / 3.6 LPA)",
        category: "Software Engineering",
        package: "₹3.6 - ₹4.2 LPA",
        requiredSkills: ["C/C++", "Java Basics", "SQL Fundamentals", "Basic Data Structures", "SDLC", "Quantitative Aptitude"],
        bonusSkills: ["HTML/CSS", "Python Basics", "Agile Methodologies"],
        typicalQuestions: 5,
        description: "Mass-recruitment foundation role requiring aptitude, logical reasoning and foundational programming."
      }
    ]
  },
  {
    id: "infosys",
    name: "Infosys",
    tier: "IT Services Leader",
    location: "Bengaluru, Pune, Hyderabad, Chennai, Chandigarh, Mysore",
    roles: [
      {
        roleId: "infy-sp",
        title: "Specialist Programmer (SP / 9.5 LPA)",
        category: "Full Stack & Algorithms",
        package: "₹9.5 - ₹12.0 LPA",
        requiredSkills: ["Advanced DSA", "Dynamic Programming", "Graph Algorithms", "Java/C++", "Database Optimization"],
        bonusSkills: ["Distributed Systems", "Kubernetes", "Redis", "Kafka"],
        typicalQuestions: 6,
        description: "Elite coding role selected through InfyTQ / HackWithInfy requiring competitive programming caliber."
      },
      {
        roleId: "infy-dse",
        title: "Digital Specialist Engineer (DSE / 6.25 LPA)",
        category: "Software Development",
        package: "₹6.25 - ₹7.0 LPA",
        requiredSkills: ["Python", "Java", "Data Structures", "Relational Databases", "Web Tech", "OOPs"],
        bonusSkills: ["React", "Spring Boot", "Git", "REST APIs"],
        typicalQuestions: 5,
        description: "Mid-tier digital engineering profile working across cloud transformation and enterprise APIs."
      },
      {
        roleId: "infy-se",
        title: "Systems Engineer (SE / 3.6 LPA)",
        category: "IT Support & Dev",
        package: "₹3.6 - ₹4.0 LPA",
        requiredSkills: ["Java or Python", "Basic SQL", "OOPs Concepts", "Computer Networks", "OS Basics"],
        bonusSkills: ["Linux", "JavaScript", "Software Testing"],
        typicalQuestions: 5,
        description: "Foundation development and testing role across Infosys global delivery units."
      }
    ]
  },
  {
    id: "wipro",
    name: "Wipro",
    tier: "IT Services Leader",
    location: "Bengaluru, Hyderabad, Chennai, Pune, Noida, Kolkata",
    roles: [
      {
        roleId: "wipro-turbo",
        title: "Project Engineer (Turbo / 6.5 LPA)",
        category: "Full Stack & Cloud",
        package: "₹6.5 - ₹7.5 LPA",
        requiredSkills: ["Java", "Data Structures", "SQL", "OOPs", "Spring Boot or Django", "Git"],
        bonusSkills: ["AWS/Azure", "Microservices", "Docker", "DevOps basics"],
        typicalQuestions: 5,
        description: "Fast-track engineering stream focused on high-value digital projects."
      },
      {
        roleId: "wipro-elite",
        title: "Project Engineer (Elite / 3.5 LPA)",
        category: "Software Development",
        package: "₹3.5 - ₹4.0 LPA",
        requiredSkills: ["C++ or Java", "Basic Data Structures", "DBMS", "Software Engineering Concepts"],
        bonusSkills: ["HTML/CSS", "Python", "SQL Basics"],
        typicalQuestions: 5,
        description: "Wipro National Qualifier Test (NQT) gateway role for campus graduates."
      }
    ]
  },
  {
    id: "cognizant",
    name: "Cognizant (CTS)",
    tier: "Global IT Leader",
    location: "Chennai, Pune, Bengaluru, Hyderabad, Kolkata, Coimbatore",
    roles: [
      {
        roleId: "cts-genc-next",
        title: "Programmer Analyst (GenC Next / 6.75 LPA)",
        category: "Advanced Engineering",
        package: "₹6.75 - ₹7.5 LPA",
        requiredSkills: ["DSA", "Java or Python", "Full Stack Development", "SQL", "System Design Basics"],
        bonusSkills: ["Cloud Fundamentals", "Docker", "CI/CD", "React.js"],
        typicalQuestions: 5,
        description: "Skill-based hiring stream for premium product and digital cloud transformation tracks."
      },
      {
        roleId: "cts-genc-elevate",
        title: "Programmer Analyst (GenC Elevate / 4.25 LPA)",
        category: "Digital Solutions",
        package: "₹4.25 - ₹5.0 LPA",
        requiredSkills: ["Java", "SQL", "OOPs", "Data Structures", "HTML/CSS/JS"],
        bonusSkills: ["Spring", "Python", "Git"],
        typicalQuestions: 5,
        description: "Enhanced track for students exhibiting solid web dev and foundational coding capabilities."
      }
    ]
  },
  {
    id: "accenture",
    name: "Accenture India",
    tier: "Consulting & Tech Giant",
    location: "Bengaluru, Gurugram, Mumbai, Pune, Hyderabad, Chennai, Kolkata",
    roles: [
      {
        roleId: "acn-fse",
        title: "Advanced Application Engineering Analyst (6.5 LPA)",
        category: "Full Stack Development",
        package: "₹6.5 - ₹7.5 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Java/Python/C#", "Web Development", "RDBMS", "Agile"],
        bonusSkills: ["Cloud Platforms", "Microservices Architecture", "Automated Testing"],
        typicalQuestions: 5,
        description: "Enterprise software architecture and digital platforms consulting role."
      },
      {
        roleId: "acn-ase",
        title: "Associate Software Engineer (ASE / 4.5 LPA)",
        category: "Software Engineering",
        package: "₹4.5 - ₹4.8 LPA",
        requiredSkills: ["Programming Fundamentals (C++/Java/Python)", "OOPs", "DBMS", "Computer Networks"],
        bonusSkills: ["Cloud Basics", "Linux", "JavaScript"],
        typicalQuestions: 5,
        description: "Flagship campus hiring program across engineering development, cloud and testing."
      }
    ]
  },
  {
    id: "hcltech",
    name: "HCLTech",
    tier: "Global Tech Services",
    location: "Noida, Bengaluru, Chennai, Hyderabad, Lucknow, Madurai",
    roles: [
      {
        roleId: "hcl-pe",
        title: "Product Engineer / Developer",
        category: "Product & Infrastructure",
        package: "₹4.25 - ₹6.0 LPA",
        requiredSkills: ["Java/C++", "Data Structures", "Operating Systems", "Networking", "Database Management"],
        bonusSkills: ["Linux Kernel", "Cloud Ops", "Embedded Systems", "REST"],
        typicalQuestions: 5,
        description: "Develops core enterprise software, hybrid cloud tools and engineering solutions."
      }
    ]
  },
  {
    id: "zoho",
    name: "Zoho Corporation",
    tier: "SaaS Product Giant",
    location: "Chennai, Tenkasi, Renigunta, Salem, Coimbatore",
    roles: [
      {
        roleId: "zoho-mts",
        title: "Member Technical Staff (Software Developer)",
        category: "Core Product Engineering",
        package: "₹8.5 - ₹14.0 LPA",
        requiredSkills: ["Core Java or C++", "Data Structures", "Complex Algorithms", "Memory Management", "Clean Code without Frameworks", "OOPs"],
        bonusSkills: ["Multi-threading", "Networking Protocols", "JavaScript Internals", "Database Internals"],
        typicalQuestions: 6,
        description: "Famous for algorithmic interviews focusing on building products from ground up without bloated libraries."
      },
      {
        roleId: "zoho-qa",
        title: "Quality Assurance & Automation Engineer",
        category: "QA & Testing",
        package: "₹5.5 - ₹8.0 LPA",
        requiredSkills: ["Java or Python", "Selenium", "API Testing", "SQL", "Test Case Design", "Git"],
        bonusSkills: ["Performance Testing (JMeter)", "CI/CD", "Security Testing"],
        typicalQuestions: 5,
        description: "Assures rock-solid reliability for Zoho suite serving 100M+ global business users."
      }
    ]
  },

  // 2. High-Growth Product Companies & Unicorns in India
  {
    id: "flipkart",
    name: "Flipkart",
    tier: "Indian E-Commerce Leader",
    location: "Bengaluru",
    roles: [
      {
        roleId: "flipkart-sde1",
        title: "Software Development Engineer 1 (SDE-1)",
        category: "Backend / Distributed Systems",
        package: "₹24.0 - ₹32.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Low Level Design (LLD)", "Java/Go", "RDBMS (MySQL/PostgreSQL)", "Multi-threading", "Concurrency"],
        bonusSkills: ["Kafka", "Redis", "Elasticsearch", "System Architecture", "High-throughput systems"],
        typicalQuestions: 6,
        description: "Powers hyper-scale e-commerce serving millions of transactions during Big Billion Days."
      },
      {
        roleId: "flipkart-ui",
        title: "UI Engineer 1 (Frontend SDE-1)",
        category: "Frontend Web & Mobile",
        package: "₹20.0 - ₹28.0 LPA",
        requiredSkills: ["JavaScript (ES6+)", "React.js", "HTML5/CSS3", "DOM Manipulation", "Web Performance Optimization", "Redux/State Management"],
        bonusSkills: ["Next.js", "TypeScript", "PWA", "Webpack/Vite", "Accessibility (a11y)"],
        typicalQuestions: 6,
        description: "Crafts butter-smooth consumer shopping experiences for hundreds of millions of Indian shoppers."
      }
    ]
  },
  {
    id: "swiggy",
    name: "Swiggy",
    tier: "Hyperlocal & Quick Commerce Unicorn",
    location: "Bengaluru, Remote India",
    roles: [
      {
        roleId: "swiggy-sde1",
        title: "Software Engineer 1 (Backend)",
        category: "Hyperlocal Systems",
        package: "₹22.0 - ₹30.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Golang or Java", "OOPs & Clean Architecture", "PostgreSQL / DynamoDB", "RESTful Services"],
        bonusSkills: ["Microservices", "Kafka", "Geospatial Indexing", "Distributed Caching"],
        typicalQuestions: 6,
        description: "Works on dispatch algorithms, routing optimization, Instamart and live delivery tracking."
      }
    ]
  },
  {
    id: "zomato",
    name: "Zomato / Blinkit",
    tier: "Food Tech & Quick Commerce Leader",
    location: "Gurugram, Bengaluru",
    roles: [
      {
        roleId: "zomato-sde1",
        title: "Software Development Engineer 1",
        category: "Full Stack & Systems",
        package: "₹22.0 - ₹28.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Python / Go / Node.js", "Relational & NoSQL DBs", "System Design Basics", "Git"],
        bonusSkills: ["Redis", "RabbitMQ / Kafka", "Docker", "App Monitoring"],
        typicalQuestions: 6,
        description: "Architecting high-frequency 10-minute grocery delivery and restaurant discovery infrastructure."
      }
    ]
  },
  {
    id: "phonepe",
    name: "PhonePe",
    tier: "FinTech Giant (UPI Leader)",
    location: "Bengaluru, Pune",
    roles: [
      {
        roleId: "phonepe-sde1",
        title: "Software Engineer (FinTech Platform)",
        category: "High Concurrency Systems",
        package: "₹26.0 - ₹34.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Java/Kotlin", "Distributed Systems Fundamentals", "ACID Transactions", "Low Level Design"],
        bonusSkills: ["Aeron / Kafka", "Cassandra / HBase", "Financial Ledger Systems", "Cryptographic protocols"],
        typicalQuestions: 6,
        description: "Handles billions of UPI payment transactions with sub-second latency and zero-failure tolerance."
      }
    ]
  },
  {
    id: "razorpay",
    name: "Razorpay",
    tier: "FinTech & Payments Unicorn",
    location: "Bengaluru",
    roles: [
      {
        roleId: "razorpay-sde1",
        title: "Software Development Engineer 1",
        category: "Payment Gateway Engineering",
        package: "₹20.0 - ₹28.0 LPA",
        requiredSkills: ["Data Structures", "PHP / Golang / Node.js", "MySQL / Aurora", "REST APIs", "Object Oriented Design"],
        bonusSkills: ["Docker", "Kubernetes", "AWS", "Security Best Practices"],
        typicalQuestions: 6,
        description: "Powering payment checkouts, neobanking, and financial infrastructure for top Indian businesses."
      }
    ]
  },
  {
    id: "cred",
    name: "CRED",
    tier: "FinTech & Premium Consumer Tech",
    location: "Bengaluru",
    roles: [
      {
        roleId: "cred-backend",
        title: "Backend Engineer (Golang / Microservices)",
        category: "High Scale Backend",
        package: "₹26.0 - ₹36.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Golang or Java", "Concurrency & Goroutines", "Database Design", "Design Patterns"],
        bonusSkills: ["gRPC", "Protobuf", "Kafka", "AWS DynamoDB", "Event Driven Architecture"],
        typicalQuestions: 6,
        description: "Builds high-performance microservices and rewards engines for credit-worthy individuals."
      }
    ]
  },
  {
    id: "paytm",
    name: "Paytm (One97 Communications)",
    tier: "FinTech & Payments",
    location: "Noida, Bengaluru",
    roles: [
      {
        roleId: "paytm-sde1",
        title: "Software Engineer - Payments & Lending",
        category: "Financial Technology",
        package: "₹14.0 - ₹20.0 LPA",
        requiredSkills: ["Java", "Data Structures", "Spring Boot", "MySQL", "OOPs", "Multithreading"],
        bonusSkills: ["Redis", "RabbitMQ", "Microservices", "Linux"],
        typicalQuestions: 5,
        description: "Designs soundbox infrastructure, POS systems, and merchant payment settlement pipelines."
      }
    ]
  },
  {
    id: "zerodha",
    name: "Zerodha",
    tier: "India's Largest Stock Broker (FinTech)",
    location: "Bengaluru (Remote Friendly)",
    roles: [
      {
        roleId: "zerodha-dev",
        title: "Full Stack / Systems Developer (Kite Platform)",
        category: "Stock Trading Systems",
        package: "₹18.0 - ₹28.0 LPA",
        requiredSkills: ["Go (Golang) or Python", "Vue.js or Vanilla JS", "PostgreSQL", "Data Structures", "Network Protocols (WebSockets)", "Linux Internals"],
        bonusSkills: ["Frugal Architecture", "Redis", "Self-hosted infrastructure", "Financial Market Knowledge"],
        typicalQuestions: 6,
        description: "Pioneer in lean, open-source technology running Kite trading platform processing 15M+ daily orders."
      }
    ]
  },
  {
    id: "groww",
    name: "Groww",
    tier: "Investment & WealthTech Unicorn",
    location: "Bengaluru",
    roles: [
      {
        roleId: "groww-sde1",
        title: "Software Development Engineer 1",
        category: "Full Stack / App Engineering",
        package: "₹20.0 - ₹28.0 LPA",
        requiredSkills: ["Java / Spring Boot", "DSA", "Microservices", "PostgreSQL", "Clean Coding Principles"],
        bonusSkills: ["Kafka", "React Native", "Docker", "High Availability Systems"],
        typicalQuestions: 6,
        description: "Making mutual funds, stocks, and credit simple and transparent for 40M+ Indian retail investors."
      }
    ]
  },
  {
    id: "meesho",
    name: "Meesho",
    tier: "Social Commerce Unicorn",
    location: "Bengaluru",
    roles: [
      {
        roleId: "meesho-sde1",
        title: "Software Engineer 1 (Backend / Logistics)",
        category: "E-Commerce Logistics",
        package: "₹22.0 - ₹30.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Java", "Spring Boot", "SQL", "Low Level Design"],
        bonusSkills: ["Redis", "Spark", "Kafka", "Supply Chain tech"],
        typicalQuestions: 6,
        description: "Democratizing internet commerce for small manufacturers and tier-2/tier-3 Indian shoppers."
      }
    ]
  },
  {
    id: "nykaa",
    name: "Nykaa",
    tier: "Beauty & Fashion E-Commerce",
    location: "Mumbai, Gurugram",
    roles: [
      {
        roleId: "nykaa-sde1",
        title: "Software Engineer 1 (Web & Catalog)",
        category: "E-Commerce Systems",
        package: "₹14.0 - ₹20.0 LPA",
        requiredSkills: ["Data Structures", "Node.js or Java", "React.js", "MySQL / MongoDB", "REST APIs"],
        bonusSkills: ["Elasticsearch", "AWS", "Content Delivery Networks"],
        typicalQuestions: 5,
        description: "Builds high-converting omni-channel beauty and lifestyle retail tech."
      }
    ]
  },
  {
    id: "urbancompany",
    name: "Urban Company",
    tier: "Home Services Tech Unicorn",
    location: "Gurugram, Bengaluru",
    roles: [
      {
        roleId: "uc-sde1",
        title: "Software Development Engineer 1",
        category: "Matchmaking & Marketplace Systems",
        package: "₹20.0 - ₹26.0 LPA",
        requiredSkills: ["DSA", "Node.js / TypeScript", "MySQL", "OOPs", "System Design Basics"],
        bonusSkills: ["Redis", "Kafka", "AWS Lambda", "Dynamic Pricing Algorithms"],
        typicalQuestions: 6,
        description: "Powers dynamic partner matching, scheduling, and verified home service delivery across 60+ cities."
      }
    ]
  },

  // 3. Global Tech Giants Operating Major R&D in India
  {
    id: "amazon",
    name: "Amazon India",
    tier: "Global Tech Titan",
    location: "Bengaluru, Hyderabad, Chennai, Delhi NCR",
    roles: [
      {
        roleId: "amzn-sde1",
        title: "Software Development Engineer 1 (SDE-1)",
        category: "Distributed Cloud Architecture",
        package: "₹30.0 - ₹45.0 LPA",
        requiredSkills: ["Data Structures & Algorithms (Trees, Graphs, DP)", "Object-Oriented Design (LLD)", "Java/C++", "System Architecture Concepts", "Amazon 16 Leadership Principles"],
        bonusSkills: ["AWS Services (DynamoDB, SQS, S3, EC2)", "Multi-threading", "Distributed Transactions"],
        typicalQuestions: 7,
        description: "World-class engineering role solving planetary scale problems with obsessive customer focus."
      },
      {
        roleId: "amzn-qae",
        title: "Quality Assurance Engineer (QAE-1)",
        category: "Test Automation & Tooling",
        package: "₹18.0 - ₹26.0 LPA",
        requiredSkills: ["Java or Python", "Data Structures", "Test Automation Frameworks", "API Testing", "CI/CD Pipelines"],
        bonusSkills: ["Performance & Load Testing", "AWS", "Security Testing"],
        typicalQuestions: 5,
        description: "Engineers automated validation frameworks safeguarding Amazon retail and AWS services."
      }
    ]
  },
  {
    id: "google",
    name: "Google India",
    tier: "Global Tech Titan",
    location: "Bengaluru, Hyderabad, Gurugram, Mumbai",
    roles: [
      {
        roleId: "goog-swe",
        title: "Software Engineer (SWE / L3 Fresher)",
        category: "Core Algorithms & Planetary Scale",
        package: "₹35.0 - ₹55.0 LPA",
        requiredSkills: ["Mastery of Data Structures & Algorithms", "Time & Space Complexity Proofs", "C++ or Java or Python", "Clean Modular Code", "System Fundamentals (OS, Concurrency, Networks)"],
        bonusSkills: ["Distributed Systems", "Graph Theory", "Compiler Design", "Machine Learning"],
        typicalQuestions: 7,
        description: "Google's gold standard engineering interview assessing raw algorithmic depth and problem solving."
      }
    ]
  },
  {
    id: "microsoft",
    name: "Microsoft India (IDC)",
    tier: "Global Tech Titan",
    location: "Hyderabad, Bengaluru, Noida",
    roles: [
      {
        roleId: "msft-sde",
        title: "Software Engineer (L59 / Fresher)",
        category: "Cloud, Office & Systems",
        package: "₹32.0 - ₹48.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "C++ / C# / Java", "System Design Fundamentals", "Object-Oriented Programming", "Operating Systems"],
        bonusSkills: ["Azure Cloud", "Distributed File Systems", "Web Performance"],
        typicalQuestions: 7,
        description: "Contribute to Azure, Office 365, Teams and Windows core platforms from India Development Centers."
      }
    ]
  },
  {
    id: "adobe",
    name: "Adobe India",
    tier: "Creative & Enterprise Tech Leader",
    location: "Noida, Bengaluru",
    roles: [
      {
        roleId: "adobe-mts",
        title: "Member of Technical Staff 1",
        category: "Creative Cloud & AI Platforms",
        package: "₹28.0 - ₹40.0 LPA",
        requiredSkills: ["Advanced DSA", "C++ or Java", "Design Patterns", "Computer Graphics / Mathematics / Systems", "OOPs"],
        bonusSkills: ["WebGL", "Computer Vision", "Machine Learning", "Microservices"],
        typicalQuestions: 6,
        description: "Pioneering creative tools (Photoshop, Premiere, Firefly AI) and Experience Cloud."
      }
    ]
  },
  {
    id: "cisco",
    name: "Cisco India",
    tier: "Networking & Cloud Security Leader",
    location: "Bengaluru",
    roles: [
      {
        roleId: "cisco-swe",
        title: "Software Engineer (Networks & Security)",
        category: "Systems & Network Software",
        package: "₹18.0 - ₹25.0 LPA",
        requiredSkills: ["C / C++ or Python", "TCP/IP & Computer Networks", "Operating Systems & Linux Internals", "Data Structures", "Socket Programming"],
        bonusSkills: ["SDN", "Docker / Kubernetes", "Cybersecurity Protocols", "Go"],
        typicalQuestions: 6,
        description: "Architecting internet backbone routers, secure firewalls, and enterprise cloud networks."
      }
    ]
  },
  {
    id: "oracle",
    name: "Oracle India",
    tier: "Database & Cloud Infrastructure",
    location: "Bengaluru, Hyderabad, Mumbai, Noida",
    roles: [
      {
        roleId: "oracle-mts",
        title: "Associate Software Engineer (OCI / Apps)",
        category: "Cloud Infrastructure & DB",
        package: "₹18.0 - ₹24.0 LPA",
        requiredSkills: ["Java", "Data Structures & Algorithms", "Relational Database Internals", "Operating Systems", "SQL"],
        bonusSkills: ["OCI", "Kubernetes", "Distributed Storage", "Linux Kernel"],
        typicalQuestions: 6,
        description: "Powers mission-critical databases, Oracle Cloud Infrastructure, and global enterprise apps."
      }
    ]
  },
  {
    id: "uber",
    name: "Uber India Tech",
    tier: "Mobility & Marketplace Tech",
    location: "Bengaluru, Hyderabad",
    roles: [
      {
        roleId: "uber-sde1",
        title: "Software Engineer 1 (Mobility & Payments)",
        category: "Real-time High Concurrency",
        package: "₹34.0 - ₹48.0 LPA",
        requiredSkills: ["Data Structures & Algorithms", "Java or Go", "Low Level Design", "Kafka", "Concurrency", "Database Optimization"],
        bonusSkills: ["Distributed Tracing", "Micro-service Orchestration", "Location Services"],
        typicalQuestions: 7,
        description: "Engineers real-time dispatch, surge pricing, rider apps and driver platforms globally."
      }
    ]
  },

  // 4. Conglomerates, Telecom, Core & Automotive Tech in India
  {
    id: "jio",
    name: "Reliance Jio Platforms",
    tier: "Telecom & Digital Conglomerate",
    location: "Navi Mumbai, Bengaluru, Hyderabad",
    roles: [
      {
        roleId: "jio-dev",
        title: "Graduate Engineer Trainee (Software & 5G Tech)",
        category: "Telecom Tech & Cloud",
        package: "₹6.0 - ₹9.0 LPA",
        requiredSkills: ["Java or Python", "Data Structures", "Networking Protocols (5G/LTE)", "SQL", "Linux", "REST APIs"],
        bonusSkills: ["Cloud Native", "Kubernetes", "AI/ML Integration", "Microservices"],
        typicalQuestions: 5,
        description: "Powers 450M+ telecom subscribers, JioFiber, JioCinema streaming and 5G network stacks."
      }
    ]
  },
  {
    id: "tatamotors",
    name: "Tata Motors (Digital & Tech Division)",
    tier: "Automotive & EV Tech",
    location: "Pune, Bengaluru",
    roles: [
      {
        roleId: "tata-ev-sw",
        title: "Embedded & Connected Vehicle Software Engineer",
        category: "EV Software & IoT",
        package: "₹7.5 - ₹12.0 LPA",
        requiredSkills: ["Embedded C/C++", "Microcontrollers", "RTOS", "CAN Protocol", "Python", "Data Structures"],
        bonusSkills: ["Battery Management Systems (BMS)", "IoT Telematics", "MATLAB/Simulink"],
        typicalQuestions: 5,
        description: "Develops smart software, telematics, and autonomous driving assistance for India's leading EV fleet."
      }
    ]
  },
  {
    id: "airtel",
    name: "Airtel Digital (Airtel X Labs)",
    tier: "Telecom Digital Division",
    location: "Gurugram, Bengaluru",
    roles: [
      {
        roleId: "airtel-sde",
        title: "Software Development Engineer (Backend / Data)",
        category: "Big Data & Telco Cloud",
        package: "₹16.0 - ₹24.0 LPA",
        requiredSkills: ["Java / Python", "Data Structures & Algorithms", "Kafka / Spark", "SQL / NoSQL", "OOPs"],
        bonusSkills: ["Redis", "Distributed Systems", "AWS"],
        typicalQuestions: 6,
        description: "Processes tens of billions of daily data events across payments, streaming, and cellular networks."
      }
    ]
  },

  // 5. Data Science, Analytics, FinTech & Specialized Roles
  {
    id: "mu-sigma",
    name: "Mu Sigma / Fractal Analytics",
    tier: "Decision Science & AI Services",
    location: "Bengaluru, Mumbai, Gurugram",
    roles: [
      {
        roleId: "analytics-assoc",
        title: "Trainee Decision Scientist / Data Analyst",
        category: "Data Analytics & Business Intelligence",
        package: "₹7.0 - ₹10.0 LPA",
        requiredSkills: ["Python (Pandas, NumPy)", "SQL & Complex Queries", "Statistics & Probability", "Data Visualization (Tableau/PowerBI)", "Business Problem Solving"],
        bonusSkills: ["Machine Learning", "R", "BigQuery", "A/B Testing Methodologies"],
        typicalQuestions: 6,
        description: "Transforms unstructured corporate datasets into actionable executive insights."
      }
    ]
  },
  {
    id: "tcs-data",
    name: "TCS AI & Analytics Unit",
    tier: "Enterprise AI Services",
    location: "Pan-India",
    roles: [
      {
        roleId: "tcs-data-analyst",
        title: "Data Analyst & Business Intelligence Specialist",
        category: "Data Engineering & Analytics",
        package: "₹6.0 - ₹8.5 LPA",
        requiredSkills: ["Advanced SQL", "Python for Data Analysis", "Excel Modeling", "Power BI / Tableau", "Data Warehousing Basics"],
        bonusSkills: ["ETL Pipelines", "Snowflake", "Azure Data Factory"],
        typicalQuestions: 5,
        description: "Delivers enterprise analytics, data pipelines, and executive dashboards for Fortune 500 clients."
      }
    ]
  },
  {
    id: "general-frontend",
    name: "Indian Tech Ecosystem (Universal Role)",
    tier: "Universal Industry Standard",
    location: "Any Indian Metro / Remote",
    roles: [
      {
        roleId: "universal-frontend",
        title: "Frontend Engineer (React / Next.js Specialist)",
        category: "Web & Mobile Frontend",
        package: "₹8.0 - ₹18.0 LPA",
        requiredSkills: ["JavaScript (ES6+)", "React.js", "HTML5 & CSS3/Tailwind", "REST API Integration", "Git & Version Control", "Responsive Design"],
        bonusSkills: ["TypeScript", "Next.js", "State Management (Redux/Zustand)", "Unit Testing (Jest)", "Performance Profiling"],
        typicalQuestions: 6,
        description: "Standard industry benchmark for frontend web applications across fast-moving startups and product companies."
      },
      {
        roleId: "universal-backend",
        title: "Full-Stack Web Developer (MERN / Node.js)",
        category: "Full Stack Development",
        package: "₹8.0 - ₹20.0 LPA",
        requiredSkills: ["JavaScript/TypeScript", "Node.js & Express", "React.js", "MongoDB & SQL", "RESTful APIs", "Authentication (JWT/OAuth)"],
        bonusSkills: ["Docker", "AWS Deployments", "Redis Caching", "CI/CD", "Socket.io"],
        typicalQuestions: 6,
        description: "High-demand full-stack builder profile capable of prototyping and launching end-to-end production features."
      },
      {
        roleId: "universal-ai",
        title: "Junior AI / ML Engineer",
        category: "Artificial Intelligence",
        package: "₹10.0 - ₹22.0 LPA",
        requiredSkills: ["Python", "PyTorch or TensorFlow", "Machine Learning Algorithms", "Data Preprocessing", "Linear Algebra & Calculus", "Scikit-Learn"],
        bonusSkills: ["LLM Fine-Tuning", "LangChain / RAG", "Hugging Face Transformers", "Vector Databases", "FastAPI"],
        typicalQuestions: 6,
        description: "Translates modern AI research and foundation models into robust production-grade intelligent systems."
      }
    ]
  }
];

// Helper to get flat array of all company + role combinations for easy searching
function getAllRolesList() {
  const list = [];
  companiesData.forEach(comp => {
    comp.roles.forEach(role => {
      list.push({
        companyId: comp.id,
        companyName: comp.name,
        companyTier: comp.tier,
        location: comp.location,
        roleId: role.roleId,
        title: role.title,
        fullLabel: `${comp.name} — ${role.title}`,
        category: role.category,
        package: role.package,
        requiredSkills: role.requiredSkills,
        bonusSkills: role.bonusSkills,
        description: role.description,
        typicalQuestions: role.typicalQuestions
      });
    });
  });
  return list;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { companiesData, getAllRolesList };
} else if (typeof window !== 'undefined') {
  window.companiesData = companiesData;
  window.getAllRolesList = getAllRolesList;
}
