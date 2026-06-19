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

### WT Implementation
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
Freemium Model: Users receive 100 free scans.
Pro Upgrade: Integrated with Stripe Checkout for secure $10 one-time payments.
Automated Provisioning: Uses Stripe Webhooks to verify payment and automatically update user entitlements in the database.

##  Demo Day Walkthrough
1.The Problem: Demonstrate a user dashboard near their scan limit (99/100).
2.The Action: Submit a new scan and show the system blocking/limiting the request.
3.The Monetization: Click "Upgrade," showcase the Stripe Checkout flow, and highlight the webhook-driven credit update.
4.The Admin Power: Log in as an Admin to navigate the Report and Delete modules, demonstrating database maintenance.

## Deployment & Setup
Deployment Notes: Hosted on the Render Free Tier. Note that the service may "spin down" after 15 minutes of inactivity; expect a ~60-second delay on the initial request.

### Installation: Bash
git clone https://github.com/[YOUR-USERNAME]/[YOUR-PROJECT-NAME].git

### Configure .env
DB_URL=...
STRIPE_KEY=...
GEMINI_API_KEY=...
### Build
./mvnw clean install
./mvnw spring-boot:run

## Work Flow Architecture:

<img src="./PhishGuard-Screenshot/Work Flow of Ai-Analysis project.png" width="800"/>

  User Entry & Authentication: The flow begins with the Auth Module (Signup/Login), issuing a JWT.
  The Core Pipeline (Scan & Analysis): This shows how a threat is ingested, verified against quotas by the Metrics Module, and then processed through Persistence, the Analysis Module (connecting to the Gemini API), and finally the Report Module.
  Monetization Flow: It clearly illustrates how the Metrics Module acts as a gatekeeper, redirecting users who hit the limit to the Upgrade Module (Stripe Checkout) and then showing the webhook loop that automatically updates their credits.
  Admin Workflow: A separate path shows how an Administrator accesses the data through the Admin Panel, enabling actions from the Block, Delete, and History modules to maintain the system.

## Screenshots Of Project:-
https://github.com/imranshaikqa20/AI-Phishing-Detection-System/tree/main/PhishGuard-Screenshot

## Deployment Links:-
Frontend :- https://ai-phishing-frontend.onrender.com/

Backend :- https://ai-phishing-backend-qrdn.onrender.com/

