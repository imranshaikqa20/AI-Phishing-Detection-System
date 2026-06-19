<h1 align="center">PhishGuard: AI-Powered Phishing Threat Detection System</h1>


## Project Overview

The Phishing Detection and Management System is a comprehensive full-stack cybersecurity application developed to detect, analyze, and prevent phishing attacks effectively. The platform leverages advanced Artificial Intelligence and Machine Learning techniques to examine suspicious URLs, emails, and web content for potential threats. By evaluating various security indicators and behavioral patterns, the system generates a predictive risk score that helps determine the likelihood of a phishing attack. Users can submit suspicious links or messages for real-time analysis and receive detailed threat assessments. The application also includes a centralized administrative dashboard that enables security teams to monitor, manage, and respond to phishing incidents efficiently. Administrators can review detected threats, track investigation progress, and maintain records for future reference. Additionally, the system provides reporting and analytics features that help identify emerging attack trends and improve organizational security strategies. Through intelligent threat detection, automated risk assessment, and streamlined incident management, the project aims to enhance cybersecurity awareness and minimize the risks associated with phishing attacks.

## Technical Architecture

The system follows a service-oriented architecture to ensure security and scalability.

### Frontend
The frontend is developed using React to provide a responsive and interactive user experience. It offers real-time threat reporting and phishing analysis results through a modern dashboard. Users can submit suspicious URLs and monitor scan statuses instantly. The interface includes authentication, user profile management, and administrative controls. React components ensure efficient rendering and smooth navigation across the application.

### Backend
The backend is built with Spring Boot using Java 17+ to deliver secure and scalable RESTful APIs. It handles user authentication, request processing, and communication with external services. The application follows a layered architecture to improve maintainability and code organization. Security mechanisms such as JWT authentication and role-based access control are implemented. Backend services also manage phishing scan workflows and incident reporting.

### Database
PostgreSQL serves as the primary database for storing application data securely and efficiently. The database uses normalized schemas to reduce redundancy and maintain data integrity. Separate tables are maintained for Users, Phishing Scans, AI Analysis results, Blocked Domains, and Reported Threats. Relationships between entities support efficient querying and reporting. Database indexing and optimization techniques improve overall system performance.

### AI Integration
The system integrates with the Gemini API to perform intelligent phishing threat analysis. The AI engine evaluates URLs, domain characteristics, and security indicators in real time. It classifies threats into different risk categories based on detected patterns. A predictive risk score is generated to help users understand the severity of potential threats. The AI-driven approach enhances detection accuracy and supports faster security decision-making.


##  Modular Architecture

| Module | Purpose | Responsibility |
|---------|---------|---------------|
| **Auth** | Security Gateway | JWT generation, BCrypt hashing, and RBAC. |
| **Scan** | URL/Text Ingestion | Submits web-based threats; validates quotas via Metrics. |
| **Upload** | File Ingestion | Handles multipart file uploads and stores blobs. |
| **Analysis** | AI Evaluation | The "Brain"—classifies threats via Gemini API. |
| **Report** | Threat Flagging | Stores evidence and AI-generated risk scoring. |
| **Metrics** | Usage Tracking | Monitors scan counts to enforce user limits. |
| **Upgrade** | Monetization | Stripe-integrated payments for session expansion. |
| **Block** | Enforcement | Restricts access to malicious items. |
| **History** | Audit Trail | Maintains a log of all scan activity. |
| **Delete** | Maintenance | Administrative cleanup of scan records. |


## Authentication & Security

### JWT Implementation
The system uses JSON Web Tokens (JWT) to provide secure and stateless authentication for users. After successful login, a signed token is generated and returned to the client. This token is included in subsequent API requests for identity verification. JWT eliminates the need for server-side session storage, improving scalability. Cryptographic signatures ensure that tokens cannot be altered or forged by unauthorized users.

### BCrypt Hashing
All user passwords are protected using the BCrypt hashing algorithm before being stored in the database. BCrypt applies a unique salt to each password, making hash values highly secure. This approach prevents attackers from retrieving original passwords even if database access is compromised. The hashing process is computationally intensive, reducing the effectiveness of brute-force attacks. As a result, user credentials remain protected both during storage and authentication.

### Route Protection
Sensitive administrative operations are secured using Spring Security's role-based access control mechanisms. Protected routes such as Delete, Block, and Report functionalities are accessible only to users with ROLE_ADMIN privileges. Spring Security filters validate authentication tokens before processing requests. Unauthorized users are automatically denied access to restricted resources. This security layer ensures that critical system actions can only be performed by authorized administrators.

## The Scan & Analysis Workflow
### 1. Request Initiation
The scan process begins when a user submits a URL, text content, or file for analysis. The Authentication Module verifies the user's identity using secure JWT-based authentication. Once authenticated, the Metrics Module checks whether the user has sufficient scan credits available. Validation rules ensure that the submitted content meets system requirements. After successful verification, the request is forwarded for processing.
### 2. Ingestion & Persistence
The submitted scan request is immediately recorded in the database for tracking and auditing purposes. A unique scan identifier is generated for each request. The initial scan status is set to "PENDING" to indicate that analysis has not yet started. Relevant metadata such as submission time, user information, and content type are stored. This persistence layer ensures reliable processing and historical record maintenance.
### 3. AI Analysis
The backend service retrieves the pending scan and sends the content to the Gemini AI API for evaluation. The AI engine analyzes various phishing indicators, suspicious patterns, and contextual information. Based on the analysis, the content is classified into predefined threat categories. A predictive risk score is generated to indicate the likelihood of phishing activity. The analysis results are then returned to the backend for further processing.
### 4. Reporting
After the AI evaluation is completed, the generated findings are stored in the ai_analysis_details table. The system records threat classifications, risk scores, and supporting analysis data. The corresponding scan record is updated from "PENDING" to "COMPLETED" status. Users can view the final assessment through the dashboard interface. These reports provide actionable insights to help identify and mitigate potential phishing threats.


##  Monetization Logic

### Freemium Model
- Every new user receives **100 free scans** upon registration.
- Free scans can be used for URL, text, and file phishing analysis.

### Pro Upgrade
- Users can upgrade to a premium plan through **Stripe Checkout**.
- A one-time payment of **$10** unlocks additional scan credits and premium features.

### Automated Provisioning
- Stripe Webhooks verify successful payments in real time.
- User entitlements and scan limits are automatically updated in the database after payment confirmation.

---

## Demo Day Walkthrough

### 1. User Registration & Login
- Register a new account or log in with existing credentials.
- Access the user dashboard.

### 2. Phishing Detection
- Submit a URL, email text, or file for analysis.
- View the AI-generated threat assessment and risk score.

### 3. Scan Limit Demonstration
- Show a user account approaching the free scan limit (e.g., 99/100 scans).
- Submit another scan and demonstrate the system enforcing the usage limit.

### 4. Premium Upgrade Flow
- Click the **Upgrade** button.
- Complete the Stripe Checkout process.
- Demonstrate automatic credit updates through Stripe Webhooks.

### 5. Admin Dashboard
- Log in as an administrator.
- Review phishing reports and security analytics.
- Monitor user activity and system statistics.

### 6. Threat Management
- Demonstrate the Report, Block, History, and Delete modules.
- Show how administrators can manage and maintain platform security.



## Deployment & Setup

This project is deployed on **Render Cloud Platform** using a Spring Boot backend, PostgreSQL database, and a modern web frontend. The application is configured for seamless cloud deployment with environment-based configuration management. User data, scan results, and payment information are securely stored in PostgreSQL. The platform integrates with Google Gemini AI for threat analysis and Stripe for payment processing. Render automatically builds and deploys the latest code from GitHub whenever changes are pushed to the repository. On the free tier, services may enter a sleep state after periods of inactivity, resulting in a short startup delay for the first request.

### Installation

```bash
git clone https://github.com/your-username/AI-Phishing-Detection-System.git
cd AI-Phishing-Detection-System
```

### Configure Environment Variables

```env
DB_URL=your_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
```

### Build & Run

```bash
./mvnw clean install
./mvnw spring-boot:run
```
## Work Flow Architecture:

<img src="./PhishGuard-Screenshot/Work Flow of Ai-Analysis project.png" width="800"/>


### User Entry & Authentication
- The workflow begins when a user registers or logs in through the **Auth Module**.
- Upon successful authentication, the system generates a **JWT (JSON Web Token)** to securely manage user sessions and authorize future requests.

### Core Threat Detection Pipeline
- Users submit URLs, text, or files through the **Scan Module** for phishing analysis.
- The **Metrics Module** validates the user's available scan quota before processing the request.
- Valid requests are stored and forwarded to the **Analysis Module**, which leverages the **Google Gemini API** for AI-powered threat detection.
- The generated results, risk scores, and evidence are then saved and presented through the **Report Module**.

### Monetization Workflow
- The **Metrics Module** continuously tracks scan usage and acts as a gatekeeper for free-tier limits.
- When a user exhausts their available scans, the system redirects them to the **Upgrade Module**.
- Users can purchase additional scan credits securely through **Stripe Checkout**.
- After successful payment, **Stripe Webhooks** automatically update the user's credits and subscription details in the database.

### Administrative Workflow
- Administrators access the platform through the **Admin Dashboard**.
- The **History Module** provides visibility into all scan activities and security events.
- The **Block Module** enables administrators to restrict malicious URLs, domains, or content.
- The **Delete Module** supports maintenance operations and cleanup of obsolete or unwanted records, ensuring efficient system management.

## Screenshots Of Project:-
https://github.com/imranshaikqa20/AI-Phishing-Detection-System/tree/main/PhishGuard-Screenshot

## Deployment Links:-
Frontend :- https://ai-phishing-frontend.onrender.com/

Backend :- https://ai-phishing-backend-qrdn.onrender.com/

