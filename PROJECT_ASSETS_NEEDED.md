# CivicGPT: Project Assets & Requirements

To transition CivicGPT from a functional MVP to a production-ready platform, we require the following specific assets and resources.

## 1. Scheme Application Forms (PDFs)
**Purpose**: To generate valid, submittable application forms for users.
**Current State**: We are generating a generic "Receipt" PDF.
**What We Need**:
*   **Official PDF Templates**: The actual government application forms for each supported scheme (e.g., *Ration Card Form B*, *PM Kisan Registration Form*).
*   **Field Mapping**: A guide on which fields in the PDF correspond to user data (e.g., "Field `txt_name_01` maps to `user.fullName`").
*   **Format**: Ideally fillable PDFs (AcroForms) or high-quality images we can overlay text onto.

## 2. Language Corpora (NLU Training Data)
**Purpose**: To improve the AI's ability to understand local dialects, colloquialisms, and specific government terminology.
**Current State**: Using a general-purpose LLM (Gemini Pro) which is good but may miss niche regional terms.
**What We Need**:
*   **Utterances List**: A spreadsheet of 50-100 ways people ask for services in Hindi, Punjabi, and English (e.g., "Ration card kho gaya", "Apply for wheat scheme").
*   **Entity Glossary**: A list of government terms and their local equivalents (e.g., "PDS" = "Rashan", "MSP" = "Sarkari Rate").
*   **Feedback Data**: If available, logs of real user queries from similar systems to train the model on edge cases.

## 3. API Keys & Infrastructure
**Purpose**: To power the AI, database, and notifications.
**Current State**: Using `GEMINI_API_KEY` (Personal).
**What We Need**:
*   **Production LLM Key**: A paid/enterprise key for Google Gemini or OpenAI to handle higher concurrency and avoid rate limits.
*   **SMS/Email Gateway**: Credentials for a service like **Twilio**, **MSG91**, or **SendGrid** to send OTPs and application status updates.
*   **Cloud Storage**: AWS S3 or Google Cloud Storage bucket credentials to securely store generated PDFs and user uploaded documents (Aadhaar, etc.).
*   **Map/Location API**: (Optional) Google Maps API key if we want to show "Nearest Seva Kendra".

## 4. Legal & Compliance Text
**Purpose**: To ensure the app is legally compliant and builds trust with users.
**Current State**: No legal documents present.
**What We Need**:
*   **Privacy Policy**: A document explaining how we collect, store, and use PII (Personally Identifiable Information) like Aadhaar numbers and income details.
*   **Terms of Service**: Rules for using the platform (e.g., "We are a facilitator, not the government").
*   **Consent Form**: Specific text users must agree to before the AI processes their data (e.g., "I consent to CivicGPT using my data to draft this form").
*   **Disclaimer**: Clear statement that this is an AI assistant and results should be verified.

## 5. Master Data (Schemes Database)
**Purpose**: To provide accurate eligibility criteria and benefits.
**Current State**: Mock data or limited database entries.
**What We Need**:
*   **Scheme Registry**: A structured dataset (Excel/JSON) of all schemes to be supported, including:
    *   Eligibility Rules (Income < X, Age > Y)
    *   Required Documents List
    *   Official Website Links
    *   Application Deadlines
