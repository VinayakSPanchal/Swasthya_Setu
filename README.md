# SwasthyaSetu — Complete Project Architecture Analysis

> **Purpose**: This document provides minute-level detail about every aspect of the project

---

## 1. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 15.x |
| **Language** | JavaScript (JSX) | ES2022+ |
| **React** | React 19 | 19.x |
| **Auth** | Clerk (`@clerk/nextjs`) | 6.30.x |
| **Database** | PostgreSQL | — |
| **ORM** | Prisma (`@prisma/client`) | 6.14.x |
| **Video Calls** | Vonage Video API (OpenTok) | Server SDK 3.25.x + Client SDK 2.30.x |
| **Styling** | Tailwind CSS v4 | 4.1.x |
| **UI Components** | Radix UI (via shadcn/ui pattern) | Various |
| **Form Handling** | React Hook Form + Zod | 7.64.x / 3.25.x |
| **Notifications** | Sonner (toast) | 2.x |
| **Date Utilities** | date-fns | 4.1.x |
| **Icons** | Lucide React | 0.510.x |
| **Theme** | next-themes | 0.4.x |
| **Dev Server** | Next.js Turbopack | — |

---

## 2. Project Directory Structure

```
doctors-appointment-platform/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout (ClerkProvider, ThemeProvider, Header, Footer)
│   ├── page.js                   # Landing page (/)
│   ├── globals.css               # Global styles
│   ├── (auth)/                   # Auth route group (no layout chrome)
│   │   ├── layout.js             # Minimal layout for auth pages
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   ├── (main)/                   # Main app route group
│   │   ├── layout.jsx            # Main layout (calls checkUser + checkAndAllocateCredits)
│   │   ├── onboarding/
│   │   │   ├── layout.js
│   │   │   └── page.jsx          # Role selection + Doctor registration form
│   │   ├── doctors/
│   │   │   ├── layout.js
│   │   │   ├── page.jsx          # Specialty grid (browse by specialty)
│   │   │   ├── [specialty]/
│   │   │   │   └── page.jsx      # Doctors list filtered by specialty
│   │   │   │   └── [id]/
│   │   │   │       ├── layout.js
│   │   │   │       ├── page.jsx  # Doctor profile + booking
│   │   │   │       └── _components/
│   │   │   │           ├── doctor-profile.jsx
│   │   │   │           ├── slot-picker.jsx
│   │   │   │           └── appointment-form.jsx
│   │   │   ├── explore/page.jsx  # Explore/search doctors
│   │   │   ├── blogs/page.jsx    # Health blogs
│   │   │   ├── medicines/page.jsx # Medicines info
│   │   │   └── components/
│   │   │       └── doctor-card.jsx
│   │   ├── doctor/
│   │   │   ├── layout.js
│   │   │   ├── page.jsx          # Doctor dashboard (tabbed: Earnings, Appointments, Availability)
│   │   │   ├── verification/page.jsx  # Verification pending page
│   │   │   └── _components/
│   │   │       ├── appointments-list.jsx
│   │   │       ├── availability-settings.jsx
│   │   │       └── doctor-earnings.jsx
│   │   ├── admin/
│   │   │   ├── layout.js         # Admin layout (verifies admin, tabs: Pending, Doctors, Payouts)
│   │   │   ├── page.jsx          # Admin dashboard
│   │   │   └── components/
│   │   │       ├── pending-doctors.jsx
│   │   │       ├── verified-doctors.jsx
│   │   │       └── pending-payouts.jsx
│   │   ├── appointments/page.jsx # Patient's appointments list
│   │   ├── pricing/page.jsx      # Pricing/credit purchase page
│   │   └── video-call/
│   │       ├── page.jsx          # Video call page (passes searchParams)
│   │       └── video-call-ui.jsx # Full video call UI component
│   └── api/                      # API routes
│       ├── blogs/route.js
│       ├── doctors/
│       │   ├── route.js
│       │   └── explore/route.js
│       └── medicines/route.js
├── actions/                      # Server Actions ("use server")
│   ├── admin.js
│   ├── appointments.js
│   ├── credits.js
│   ├── doctor.js
│   ├── doctors-listing.js
│   ├── exploreDoctors.js
│   ├── onboarding.js
│   ├── patient.js
│   └── payout.js
├── components/                   # Shared React Components
│   ├── header.jsx                # Global navigation header
│   ├── appointment-card.jsx      # Reusable appointment card with dialog
│   ├── page-header.jsx           # Page title + back navigation
│   ├── pricing.jsx               # Pricing display component
│   ├── theme-provider.jsx        # Dark/light theme wrapper
│   └── ui/                       # shadcn/ui primitives (13 components)
│       ├── accordion.jsx
│       ├── alert.jsx
│       ├── badge.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── select.jsx
│       ├── separator.jsx
│       ├── sonner.jsx
│       ├── tabs.jsx
│       └── textarea.jsx
├── hooks/
│   └── use-fetch.js              # Custom hook for server action calls (loading/error/data)
├── lib/
│   ├── checkUser.js              # Clerk → DB user sync
│   ├── data.js                   # Static content (features, testimonials, creditBenefits)
│   ├── location.js               # Location utilities
│   ├── prisma.js                 # Prisma client singleton
│   ├── schema.js                 # Zod validation schemas
│   ├── specialities.js           # 16 medical specialties with icons
│   └── utils.js                  # cn() classname utility
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # DB migrations
├── middleware.js                  # Clerk auth middleware (route protection)
├── next.config.mjs               # Next.js config
├── package.json                  # Dependencies
└── public/                       # Static assets (logos, banners)
```

---

## 3. Database Schema (ER Diagram Data)

### 3.1 Models (Entities)

#### [User](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/lib/checkUser.js#4-60)
| Field | Type | Constraints | Description |
|---|---|---|---|
| [id](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/app/%28main%29/video-call/video-call-ui.jsx#19-328) | String (UUID) | PK, auto-generated | |
| `clerkUserId` | String | Unique | Clerk's external user ID |
| `email` | String | Unique | |
| `name` | String? | Optional | |
| `imageUrl` | String? | Optional | Profile picture URL |
| `role` | UserRole | Default: UNASSIGNED | UNASSIGNED / PATIENT / DOCTOR / ADMIN |
| `createdAt` | DateTime | Default: now() | |
| `updatedAt` | DateTime | Auto-updated | |
| `credits` | Int | Default: 2 | Credit balance (used by both patients and doctors) |
| `specialty` | String? | Doctor-only | Medical specialty |
| `experience` | Int? | Doctor-only | Years of experience |
| `credentialUrl` | String? | Doctor-only | URL to credential document |
| `description` | String? (Text) | Doctor-only | Professional description |
| `verificationStatus` | VerificationStatus? | Default: PENDING, Doctor-only | PENDING / VERIFIED / REJECTED |

**Relations:**
- `patientAppointments` → Appointment[] (as patient)
- `doctorAppointments` → Appointment[] (as doctor)
- `availabilities` → Availability[]
- `transactions` → CreditTransaction[]
- `payouts` → Payout[]

#### [Availability](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js#7-85)
| Field | Type | Constraints | Description |
|---|---|---|---|
| [id](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/app/%28main%29/video-call/video-call-ui.jsx#19-328) | String (UUID) | PK | |
| `doctorId` | String | FK → User.id | |
| `startTime` | DateTime | | Start of available window |
| `endTime` | DateTime | | End of available window |
| `status` | SlotStatus | Default: AVAILABLE | AVAILABLE / BOOKED / BLOCKED |

**Indexes:** `[doctorId, startTime]`
**On Delete:** Cascade from User

#### [Appointment](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/components/appointment-card.jsx#40-579)
| Field | Type | Constraints | Description |
|---|---|---|---|
| [id](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/app/%28main%29/video-call/video-call-ui.jsx#19-328) | String (UUID) | PK | |
| `patientId` | String | FK → User.id | |
| `doctorId` | String | FK → User.id | |
| `startTime` | DateTime | | |
| `endTime` | DateTime | | |
| `status` | AppointmentStatus | Default: SCHEDULED | SCHEDULED / COMPLETED / CANCELLED |
| `notes` | String? (Text) | | Doctor's clinical notes |
| `patientDescription` | String? (Text) | | Patient's symptom description |
| `videoSessionId` | String? | | Vonage Video API Session ID |
| `videoSessionToken` | String? | | Stored token (optional) |
| `createdAt` | DateTime | Default: now() | |
| `updatedAt` | DateTime | Auto-updated | |

**Indexes:** `[status, startTime]`, `[doctorId, startTime]`

#### `CreditTransaction`
| Field | Type | Constraints | Description |
|---|---|---|---|
| [id](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/app/%28main%29/video-call/video-call-ui.jsx#19-328) | String (UUID) | PK | |
| `userId` | String | FK → User.id | |
| `amount` | Int | | Positive = addition, Negative = deduction |
| `type` | TransactionType | | CREDIT_PURCHASE / APPOINTMENT_DEDUCTION / ADMIN_ADJUSTMENT |
| `packageId` | String? | | Which subscription plan |
| `createdAt` | DateTime | Default: now() | |

**On Delete:** Cascade from User

#### [Payout](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#181-264)
| Field | Type | Constraints | Description |
|---|---|---|---|
| [id](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/app/%28main%29/video-call/video-call-ui.jsx#19-328) | String (UUID) | PK | |
| `doctorId` | String | FK → User.id | |
| `amount` | Float | | Total payout (credits × $10) |
| `credits` | Int | | Number of credits being paid |
| `platformFee` | Float | | $2 per credit |
| `netAmount` | Float | | $8 per credit (doctor receives) |
| `paypalEmail` | String | | Doctor's PayPal email |
| `status` | PayoutStatus | Default: PROCESSING | PROCESSING / PROCESSED |
| `createdAt` | DateTime | | |
| `updatedAt` | DateTime | | |
| `processedAt` | DateTime? | | When admin processed |
| `processedBy` | String? | | Admin user ID |

**Indexes:** `[status, createdAt]`, `[doctorId, status]`
**On Delete:** Cascade from User

#### `LocalDoctor`
| Field | Type | Constraints | Description |
|---|---|---|---|
| [id](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/app/%28main%29/video-call/video-call-ui.jsx#19-328) | String (UUID) | PK | |
| `name` | String | | |
| `speciality` | String | | |
| `location` | String | | |
| `latitude` | Float? | | |
| `longitude` | Float? | | |
| `rating` | Float | Default: 0 | |
| `reviewCount` | Int | Default: 0 | |
| `photoUrl` | String? | | |
| `phone` | String? | | |
| `address` | String? | | |
| `clinicName` | String? | | |
| `experience` | Int? | | |
| `education` | String? | | |
| `languages` | String? | | |
| `isVerified` | Boolean | Default: false | |

**Indexes:** `[speciality]`, `[location]`, `[rating]`

### 3.2 Enums

| Enum | Values |
|---|---|
| [UserRole](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/onboarding.js#9-82) | UNASSIGNED, PATIENT, DOCTOR, ADMIN |
| `VerificationStatus` | PENDING, VERIFIED, REJECTED |
| `SlotStatus` | AVAILABLE, BOOKED, BLOCKED |
| `AppointmentStatus` | SCHEDULED, COMPLETED, CANCELLED |
| `TransactionType` | CREDIT_PURCHASE, APPOINTMENT_DEDUCTION, ADMIN_ADJUSTMENT |
| `PayoutStatus` | PROCESSING, PROCESSED |

### 3.3 Relationships Diagram (Text)

```
User (1) ──── (0..*) Availability       [doctorId → User.id]
User (1) ──── (0..*) Appointment        [as patient: patientId → User.id]
User (1) ──── (0..*) Appointment        [as doctor: doctorId → User.id]
User (1) ──── (0..*) CreditTransaction  [userId → User.id]
User (1) ──── (0..*) Payout             [doctorId → User.id]
```

> **Note:** `LocalDoctor` is a standalone model with NO foreign key relationships to [User](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/lib/checkUser.js#4-60).

---

## 4. User Roles & Permissions

### 4.1 Role Hierarchy

| Role | Access |
|---|---|
| **UNASSIGNED** | Landing page, onboarding page only |
| **PATIENT** | Browse doctors, book appointments, view own appointments, join video calls, buy credits, view pricing |
| **DOCTOR** | Doctor dashboard (earnings, appointments, availability), join video calls, add notes, mark complete, cancel appointments, request payouts |
| **ADMIN** | Admin dashboard (approve/reject doctors, manage verified doctors, approve payouts) |

### 4.2 Protected Routes (Middleware)

The following routes require authentication via Clerk middleware:
- `/doctors(.*)` — Browse doctors
- `/onboarding(.*)` — Role selection
- `/doctor(.*)` — Doctor dashboard
- `/admin(.*)` — Admin dashboard
- `/video-call(.*)` — Video consultation
- `/appointments(.*)` — Patient appointments

**Unprotected routes:** `/` (landing), `/sign-in`, `/sign-up`

### 4.3 Role-Based Header Navigation

| User State | Visible Nav Items |
|---|---|
| **Signed Out** | Medicines, Health Blogs, Pricing, Sign In button |
| **UNASSIGNED** | Medicines, Health Blogs, Complete Profile, Credits badge, User avatar |
| **PATIENT** | Medicines, Health Blogs, Explore Doctors, My Appointments, Credits badge (links to /pricing), User avatar |
| **DOCTOR** | Medicines, Health Blogs, Doctor Dashboard, Earned Credits badge (links to /doctor), User avatar |
| **ADMIN** | Medicines, Health Blogs, Admin Dashboard, User avatar |

---

## 5. Server Actions (Detailed Function List)

### 5.1 [actions/onboarding.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/onboarding.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [setUserRole(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/onboarding.js#9-82) | FormData: `role`, `specialty?`, `experience?`, `credentialUrl?`, `description?` | `{success, redirect}` | Sets user role. PATIENT → redirect `/doctors`. DOCTOR → saves extra fields + redirect `/doctor/verification` |
| [getCurrentUser()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/onboarding.js#83-106) | — | User object or null | Gets authenticated user from DB |

### 5.2 [actions/appointments.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/appointments.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [bookAppointment(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/appointments.js#21-147) | FormData: `doctorId`, `startTime`, `endTime`, `description?` | `{success, appointment}` | Validates patient credits (≥2), checks doctor verification, checks slot overlap, creates Vonage session, deducts credits, creates appointment |
| [generateVideoToken(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/appointments.js#160-260) | FormData: `appointmentId` | `{success, videoSessionId, token}` | Validates user is participant, appointment is SCHEDULED, within 30 min of start time, generates Vonage token |
| [getDoctorById(doctorId)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/appointments.js#261-284) | String | `{doctor}` | Gets verified doctor by ID |
| [getAvailableTimeSlots(doctorId)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/appointments.js#285-412) | String | `{days: [{date, displayDate, slots}]}` | Generates 30-min slots for next 4 days based on doctor's Availability, filtered against existing appointments |

### 5.3 [actions/doctor.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [setAvailabilitySlots(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js#7-85) | FormData: `startTime`, `endTime` | `{success, slot}` | Replaces doctor's availability (deletes old, creates new) |
| [getDoctorAvailability()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js#86-122) | — | `{slots: Availability[]}` | Returns current doctor's availability slots |
| [getDoctorAppointments()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js#127-166) | — | `{appointments}` | Returns SCHEDULED appointments with patient details |
| [cancelAppointment(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js#167-283) | FormData: `appointmentId` | `{success}` | Cancels appointment + refunds 2 credits to patient, deducts 2 from doctor (transaction) |
| [addAppointmentNotes(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js#284-342) | FormData: `appointmentId`, `notes` | `{success, appointment}` | Doctor adds/edits clinical notes |
| [markAppointmentCompleted(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctor.js#343-420) | FormData: `appointmentId` | `{success, appointment}` | Doctor marks as COMPLETED (only after endTime has passed) |

### 5.4 [actions/admin.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [verifyAdmin()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#7-30) | — | Boolean | Checks if current user has ADMIN role |
| [getPendingDoctors()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#31-54) | — | `{doctors}` | Returns doctors with PENDING verification |
| [getVerifiedDoctors()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#55-79) | — | `{doctors}` | Returns all VERIFIED doctors |
| [updateDoctorStatus(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#80-111) | FormData: `doctorId`, `status` (VERIFIED/REJECTED) | `{success}` | Admin approves or rejects doctor |
| [updateDoctorActiveStatus(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#112-145) | FormData: `doctorId`, `suspend` (true/false) | `{success}` | Admin suspends (→PENDING) or reinstates (→VERIFIED) |
| [getPendingPayouts()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#146-180) | — | `{payouts}` with doctor details | Returns PROCESSING payouts |
| [approvePayout(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/admin.js#181-264) | FormData: `payoutId` | `{success}` | Admin approves payout: marks PROCESSED, deducts credits from doctor, creates transaction record (all in DB transaction) |

### 5.5 [actions/credits.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/credits.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [checkAndAllocateCredits(user)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/credits.js#18-121) | User object | Updated User or null | Checks Clerk subscription plan, allocates monthly credits if not yet allocated this month. Plans: free_user (0), standard (10), premium (24) |
| [deductCreditsForAppointment(userId, doctorId)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/credits.js#122-197) | Strings | `{success, user}` | Deducts 2 credits from patient, adds 2 to doctor, creates transaction records for both (in DB transaction) |

### 5.6 [actions/payout.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/payout.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [requestPayout(formData)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/payout.js#11-88) | FormData: `paypalEmail` | `{success, payout}` | Doctor requests payout for ALL credits. $10/credit total, $2 platform fee, $8 to doctor. Only 1 pending payout allowed at a time. |
| [getDoctorPayouts()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/payout.js#89-125) | — | `{payouts}` | Returns all payouts for current doctor |
| [getDoctorEarnings()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/payout.js#126-196) | — | `{earnings: {totalEarnings, thisMonthEarnings, completedAppointments, ...}}` | Calculates earnings summary |

### 5.7 [actions/patient.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/patient.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [getPatientAppointments()](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/patient.js#4-54) | — | `{appointments}` with doctor details | Returns all appointments for authenticated patient |

### 5.8 [actions/doctors-listing.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctors-listing.js)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| [getDoctorsBySpecialty(specialty)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/actions/doctors-listing.js#5-27) | String | `{doctors}` | Returns verified doctors filtered by specialty |

---

## 6. Key Business Logic Flows

### 6.1 User Registration & Onboarding Flow

```
1. User visits site → clicks "Get Started" or "Sign Up"
2. Clerk handles sign-up (email/password or OAuth)
3. On first authenticated visit, `checkUser()` in Header runs:
   a. Looks up user by clerkUserId in DB
   b. If not found → creates new User record (role: UNASSIGNED, credits: 2)
   c. Creates initial CreditTransaction (type: CREDIT_PURCHASE, packageId: "free_user", amount: 0)
4. User is redirected to /onboarding
5. User chooses role:
   a. PATIENT → role updated → redirect to /doctors
   b. DOCTOR → shows doctor form (specialty, experience, credentialUrl, description)
      → role set to DOCTOR, verificationStatus: PENDING → redirect to /doctor/verification
6. For PATIENT: checkAndAllocateCredits() runs in Header on every page load
   → Checks Clerk subscription → allocates monthly credits if due
```

### 6.2 Doctor Verification Flow

```
1. Doctor submits registration → status: PENDING
2. Admin views /admin → "Pending Verification" tab
3. Admin can view credential URL, specialty, experience
4. Admin clicks "Approve" → status: VERIFIED → Doctor can now appear in listings
   OR Admin clicks "Reject" → status: REJECTED
5. Admin can also "Suspend" verified doctors → reverts to PENDING
```

### 6.3 Appointment Booking Flow

```
1. Patient browses /doctors → clicks specialty → sees doctor cards
2. Patient clicks doctor → views profile + slot picker
3. Slot picker calls getAvailableTimeSlots(doctorId):
   a. Fetches doctor's Availability record (startTime/endTime window)
   b. Generates 30-minute slots for next 4 days
   c. Filters out past slots and already-booked slots
4. Patient selects slot → fills description → clicks "Book"
5. bookAppointment() runs:
   a. Validates patient exists and has role PATIENT
   b. Validates doctor exists and is VERIFIED
   c. Checks patient has ≥ 2 credits
   d. Checks no overlapping appointments for that doctor
   e. Creates Vonage Video API session (routed media mode)
   f. Calls deductCreditsForAppointment():
      - Patient credits -= 2 (+ CreditTransaction record)
      - Doctor credits += 2 (+ CreditTransaction record)
   g. Creates Appointment record with videoSessionId
   h. Revalidates /appointments path
```

### 6.4 Video Call Flow

```
1. Patient/Doctor views appointment card → clicks "Join Video Call"
   (Button enabled only 30 min before until end time)
2. generateVideoToken() runs:
   a. Validates user is participant of the appointment
   b. Validates appointment status is SCHEDULED
   c. Validates current time is within 30 min of start
   d. Generates Vonage client token with:
      - role: "publisher"
      - expireTime: 1 hour after appointment endTime
      - connectionData: user name, role, userId (JSON)
   e. Stores token in appointment record
   f. Returns { videoSessionId, token }
3. Client redirects to /video-call?sessionId=...&token=...
4. Video call page loads Vonage Client SDK via <Script> tag
5. OT.initSession(appId, sessionId) → session.connect(token)
6. On sessionConnected:
   - OT.initPublisher("publisher") → renders local video
   - session.publish(publisher) → sends stream
7. On streamCreated:
   - session.subscribe(stream, "subscriber") → renders remote video
8. Controls: toggle video, toggle audio, end call
9. End call: publisher.destroy() → session.disconnect() → redirect to /appointments
```

### 6.5 Credit System Flow

```
Credit Economy:
- Each appointment costs 2 credits
- Credits transfer: Patient → Doctor (at booking)
- Credits refund: Doctor → Patient (on cancellation)

Subscription Plans (via Clerk Billing):
┌──────────┬─────────────────┐
│ Plan     │ Monthly Credits  │
├──────────┼─────────────────┤
│ free_user│ 0 credits       │
│ standard │ 10 credits      │
│ premium  │ 24 credits      │
└──────────┴─────────────────┘

New users get 2 free credits on registration.

Monthly allocation:
1. Header renders → checkAndAllocateCredits(user) called for PATIENT role
2. Checks Clerk subscription (has({ plan: "..." }))
3. Checks if CREDIT_PURCHASE transaction exists for current month with same plan
4. If not → creates CreditTransaction + increments user.credits
```

### 6.6 Payout Flow

```
Payout Economics:
- $10 total value per credit
- $2 platform fee per credit
- $8 net to doctor per credit

Flow:
1. Doctor views Earnings tab → sees available credits + payout amount
2. Doctor enters PayPal email → clicks "Request Payout"
3. requestPayout():
   a. Validates doctor has credits > 0
   b. Checks no existing PROCESSING payout
   c. Creates Payout record (PROCESSING)
4. Admin views /admin → "Payouts" tab
5. Admin approves payout → approvePayout():
   a. Verifies payout exists and is PROCESSING
   b. Checks doctor still has enough credits
   c. In DB transaction:
      - Payout status → PROCESSED
      - Doctor credits -= payout.credits
      - Creates CreditTransaction (ADMIN_ADJUSTMENT)
6. Doctor receives payment via PayPal (manual process by admin)
```

### 6.7 Appointment Lifecycle

```
States: SCHEDULED → COMPLETED or CANCELLED

SCHEDULED:
  ├── cancelAppointment() → CANCELLED
  │     (by patient OR doctor)
  │     + Refund: patient += 2 credits, doctor -= 2 credits
  │     + 2 CreditTransaction records created
  │
  └── markAppointmentCompleted() → COMPLETED
        (by doctor only, after endTime)
        No credit changes — credits already transferred at booking
```

---

## 7. Component Architecture

### 7.1 Component Tree

```
RootLayout (app/layout.js)
├── ClerkProvider (dark theme)
│   └── ThemeProvider (dark default)
│       ├── Header (server component)
│       │   ├── Logo (Image)
│       │   ├── Nav links (role-conditional)
│       │   ├── Credits badge
│       │   ├── SignInButton / UserButton (Clerk)
│       │   └── [runs checkUser() + checkAndAllocateCredits()]
│       ├── <main> {children} </main>
│       ├── Toaster (Sonner)
│       └── Footer

Landing Page (app/page.js)
├── Hero Section (banner image, CTA buttons)
├── Features Section (6 feature cards from lib/data.js)
├── Pricing Section (Clerk PricingTable + Pricing component)
├── Credit Benefits Card
├── Testimonials Section (3 cards from lib/data.js)
└── CTA Section

Onboarding Page (app/(main)/onboarding/page.jsx) — CLIENT COMPONENT
├── Step 1: Role Selection
│   ├── Patient Card (→ setUserRole PATIENT)
│   └── Doctor Card (→ next step)
└── Step 2: Doctor Form
    ├── Specialty Select (16 specialties)
    ├── Experience Input
    ├── Credential URL Input
    ├── Description Textarea
    └── Submit Button (→ setUserRole DOCTOR)

Doctor Dashboard (app/(main)/doctor/page.jsx) — SERVER COMPONENT
├── Tabs
│   ├── Earnings Tab
│   │   └── DoctorEarnings (earnings summary + payout request form)
│   ├── Appointments Tab
│   │   └── DoctorAppointmentsList
│   │       └── AppointmentCard[] (per appointment)
│   └── Availability Tab
│       └── AvailabilitySettings (set start/end time)

Admin Dashboard (app/(main)/admin/)
├── Layout (verifies admin, Tabs)
│   ├── Pending Verification Tab → PendingDoctors
│   ├── Doctors Tab → VerifiedDoctors
│   └── Payouts Tab → PendingPayouts

Patient Appointments (app/(main)/appointments/page.jsx)
├── PageHeader
└── AppointmentCard[] (per appointment)

AppointmentCard (components/appointment-card.jsx) — CLIENT COMPONENT
├── Card (summary: name, specialty, date, time, status badge)
├── "View Details" button → Dialog
│   ├── Other party info
│   ├── Scheduled time
│   ├── Status badge
│   ├── Patient description
│   ├── "Join Video Call" button (conditional)
│   ├── Doctor notes (view/edit)
│   └── Actions: Mark Complete / Cancel / Close

Video Call Page (app/(main)/video-call/)
├── page.jsx (extracts searchParams: sessionId, token)
└── VideoCall (video-call-ui.jsx) — CLIENT COMPONENT
    ├── Script (loads Vonage SDK from CDN)
    ├── Publisher div (local video)
    ├── Subscriber div (remote video)
    └── Controls (toggle video, toggle audio, end call)
```

### 7.2 Shared UI Components (shadcn/ui)

| Component | Radix Primitive | Usage |
|---|---|---|
| Accordion | @radix-ui/react-accordion | — |
| Alert | — | Error/info messages |
| Badge | — | Status indicators, credit count |
| Button | @radix-ui/react-slot | All CTAs |
| Card | — | Content containers |
| Dialog | @radix-ui/react-dialog | Appointment details, confirmations |
| Input | — | Form fields |
| Label | @radix-ui/react-label | Form labels |
| Select | @radix-ui/react-select | Specialty picker |
| Separator | @radix-ui/react-separator | Visual dividers |
| Sonner | sonner | Toast notifications |
| Tabs | @radix-ui/react-tabs | Dashboard navigation |
| Textarea | — | Notes, descriptions |

### 7.3 Custom Hook

**[useFetch(serverActionFn)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/hooks/use-fetch.js#4-27)** — Generic hook wrapping any server action:
- Returns: `{ data, loading, error, fn, setData }`
- [fn(...args)](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/hooks/use-fetch.js#9-24) calls the server action, manages loading/error state, shows error toast

---

## 8. API Routes

| Route | Method | Description |
|---|---|---|
| `GET /api/blogs` | GET | Fetches health blog content |
| `GET /api/doctors` | GET | Fetches doctor listings |
| `GET /api/doctors/explore` | GET | Doctor search/explore endpoint |
| `GET /api/medicines` | GET | Fetches medicine information |

---

## 9. Authentication & Middleware Flow

```
Request → Clerk Middleware
├── Extracts userId from session
├── Checks if route matches protected patterns:
│   /doctors(.*)  /onboarding(.*)  /doctor(.*)
│   /admin(.*)    /video-call(.*)  /appointments(.*)
├── If protected AND no userId → redirectToSignIn()
└── Otherwise → NextResponse.next()
```

**User Sync Flow (in Header component):**
```
Every page load (Header server component):
1. checkUser() →
   a. currentUser() from Clerk
   b. Find in DB by clerkUserId
   c. If not found → Create new User record
   d. Return user with latest CREDIT_PURCHASE transaction
2. If user.role === "PATIENT" →
   checkAndAllocateCredits(user)
   → Check Clerk subscription → allocate monthly credits if due
```

---

## 10. Data Flow Summary

### 10.1 Client → Server Data Flow

```
Client Component
  ↓ (FormData)
useFetch(serverAction)
  ↓
Server Action ("use server")
  ↓ (auth() → userId)
  ↓ (db.model.* via Prisma)
PostgreSQL Database
  ↓ (result)
Server Action
  ↓ (revalidatePath)
Client Component (data state updated via useFetch)
```

### 10.2 Server Component Data Flow

```
Server Component (async)
  ↓ (await serverAction())
Server Action
  ↓ (auth() + db queries)
PostgreSQL
  ↓ (data)
Server Component
  ↓ (props)
Client Components (rendered with data)
```

---

## 11. External Service Integrations

### 11.1 Clerk (Authentication & Billing)
- **Auth**: Sign in/up, session management, middleware route protection
- **Themes**: Dark theme (`@clerk/themes`)
- **Billing**: Subscription plans (free_user, standard, premium) via `auth().has({ plan: "..." })`
- **Components**: `SignInButton`, `UserButton`, `SignedIn`, `SignedOut`, `PricingTable`

### 11.2 Vonage Video API (OpenTok)
- **Server-side**: `@vonage/server-sdk` creates sessions, generates tokens
  - Init: `new Auth({ applicationId, privateKey })` → `new Vonage(credentials)`
  - `vonage.video.createSession({ mediaMode: "routed" })` → returns sessionId
  - `vonage.video.generateClientToken(sessionId, options)` → returns JWT token
- **Client-side**: CDN script `@vonage/client-sdk-video`
  - `OT.initSession(appId, sessionId)` → session
  - `session.connect(token)` → connected
  - `OT.initPublisher("publisher")` → local stream
  - `session.subscribe(stream, "subscriber")` → remote stream

### 11.3 PostgreSQL (via Prisma)
- Connection: `DATABASE_URL` env var
- Client singleton in [lib/prisma.js](file:///c:/Users/Vinayak/Downloads/doctors-appointment-platform-main/doctors-appointment-platform-main/lib/prisma.js) (globalThis pattern for hot reload)
- Uses `db.$transaction()` for multi-step operations (credit transfers, payouts)

---

## 12. Medical Specialties

The platform supports 16 specialties:
1. General Medicine
2. Cardiology
3. Dermatology
4. Endocrinology
5. Gastroenterology
6. Neurology
7. Obstetrics & Gynecology
8. Oncology
9. Ophthalmology
10. Orthopedics
11. Pediatrics
12. Psychiatry
13. Pulmonology
14. Radiology
15. Urology
16. Other

---

## 13. Environment Variables

| Variable | Used By | Purpose |
|---|---|---|
| `DATABASE_URL` | Prisma | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | Client-side Clerk key |
| `CLERK_SECRET_KEY` | Clerk | Server-side Clerk key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk | Sign-in page URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk | Sign-up page URL |
| `NEXT_PUBLIC_VONAGE_APPLICATION_ID` | Vonage | Video API application ID |
| `VONAGE_PRIVATE_KEY` | Vonage | Private key for auth (path or content) |

---
