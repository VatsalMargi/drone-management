# Drone Survey Management System

A scalable platform designed for large organizations to plan, manage, and monitor autonomous drone surveys across multiple global sites. This system provides a critical backbone for drone operations, focusing on mission management, real-time monitoring, fleet coordination, and survey reporting.

## Live Demo





**Demo Video:** [Video](https://github.com/user-attachments/assets/946bc3c0-fb1d-44d0-b84b-20dcb337668d)

**Link to Deployed Application:** [https://drone-management-eight.vercel.app/](https://drone-management-eight.vercel.app/)

## Key Features

This project implements the core functionalities required for a robust drone operations platform.

#### Mission Planning & Configuration
* **Interactive Map Interface:** Define survey areas and flight paths by drawing polygons directly on a map.
* **Mission Parameters:** Configure essential flight parameters such as altitude, waypoints, and survey patterns (`GRID`, `CROSSHATCH`, `PERIMETER`).
* **Data Parameters:** Set data collection parameters for missions.

#### Fleet Visualisation & Management
* **Centralized Dashboard:** View an organization-wide inventory of all drones in a clean, tabular format.
* **Live Status:** See the real-time status of each drone (e.g., `Available`, `In-Mission`) and monitor vital statistics like battery level.
* **Fleet Expansion:** Easily add new drones to the fleet.

#### Real-time Mission Monitoring
* **Live Map Visualization:** Monitor active missions on a dedicated page that visualizes the drone's real-time position moving along its planned flight path.
* **Progress Tracking:** Display live mission progress as a percentage with status updates for `PLANNED`, `IN_PROGRESS`, `PAUSED`, `COMPLETED`, and `ABORTED` missions.
* **Mission Control:** Start, Pause, Resume, and Abort missions directly from the user interface.

## Tech Stack

This project is built with a modern, scalable, and type-safe technology stack.

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **Mapping:** Leaflet, React-Leaflet & Leaflet-Geoman
* **Deployment:** Vercel

## Getting Started

To run this project locally, follow these steps:

**1. Prerequisites**
* Node.js (v18 or later)
* npm or yarn
* A PostgreSQL database instance

**2. Clone the Repository**
```bash
git clone [https://github.com/](https://github.com/)[VatsalMargi]/[drone-management].git
cd [drone-management]
```

**3. Install Dependencies**

```bash
npm  install
```

**4. Set Up Environment Variables**
* Now, open the .env file and add your PostgreSQL database connection string:
```bash
cp .env.example .env
```
* Now, open the .env file and add your PostgreSQL database connection string:
```bash
# .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**5. Run Database Migrations**
*Apply the database schema to your database:
```bash
npx prisma migrate dev
```

**6. Seed the Database**
* Populate the database with initial sample data (one organization and three drones):
```bash
npx prisma db seed
```

**7. Run the Development Server**
```bash
npm run dev
```

## Project Write-Up

### How I Approached the Problem

My approach to building the Drone Survey Management System was grounded in a **progressive, feature-driven methodology**, starting with a robust foundation and iteratively adding core functionalities. This ensured a stable and scalable application at every stage of development.

* **Foundation First:** The initial phase focused on establishing a modern, type-safe technology stack. I chose **Next.js 14 with the App Router** as the core framework. This enabled the use of **React Server Components** and **Server Actions**, which was central to the architecture. This approach improves performance by minimizing client-side JavaScript and simplifies the data flow by allowing server-side logic and data fetching to co-locate with the components that need them. The backend was powered by a **PostgreSQL** database managed via the **Prisma ORM**, providing end-to-end type safety from the database schema to the frontend components.

* **Incremental Feature Development:** After establishing the foundation, I implemented the key functional requirements in a logical order, ensuring each feature was stable before moving to the next:
    1. **Fleet Visualisation:** I began with the **Fleet Visualisation and Management Dashboard**, as it provided an immediate visual representation of the core data (drones) and confirmed the database connection was working correctly.
    2. **Mission Planning:** Next, I developed the **Mission Planning and Configuration System**. This was the most interactive feature, requiring the integration of third-party libraries like Leaflet for map-based survey area definition.
    3. **Real-time Monitoring:** Finally, I tackled the most complex feature: the **Real-time Mission Monitoring Interface**, including a backend simulation API and mission control actions.

### Trade-offs Considered During Development

Several key decisions were made during development that involved balancing complexity, speed, and technical purity.

* **Real-time Implementation: Polling vs. WebSockets**
    * **Decision:** I chose to implement the real-time mission monitoring updates using client-side polling (fetching data every 3 seconds) instead of a persistent WebSocket connection.
    * **Trade-off:** Polling is less efficient and not truly "instantaneous" compared to WebSockets. It generates more server requests and has a built-in latency. However, it is significantly simpler to implement within a serverless architecture like Vercel's, as it leverages the existing stateless HTTP API routes without requiring a stateful, long-running server or a third-party WebSocket service.
    * **Justification:** For this project's scope, polling was a pragmatic choice that successfully demonstrates the real-time visualization requirement without introducing significant architectural complexity.

* **Authentication: Deferred for Core Functionality**
    * **Decision:** We made a conscious decision to set aside an authentication system and build the application in a "single-organization" mode.
    * **Trade-off:** This decision traded multi-tenancy and user-specific data security for a much faster development cycle focused on the core drone management features outlined in the scope.
    * **Justification:** The primary challenge was to build the mission planning, management, and monitoring systems. The architecture is ready to have a robust authentication layer added back in, where a hardcoded `organizationId` would be replaced by an ID from the user's session.

### Strategy for Ensuring Safety and Adaptability

The system was designed from the ground up with safety and future adaptability in mind.

* **Strategy for Safety:**
    * **End-to-End Type Safety:** By using TypeScript across the entire stack and Prisma's generated types, the application is protected from a wide range of common runtime errors. Data shapes are strictly defined from the database schema all the way to the component props.
    * **Secure Server Actions:** All database mutations (creating missions, adding drones, aborting missions) are handled exclusively by **Next.js Server Actions**. This ensures that all business logic runs securely on the server and is not exposed to the client.
    * **Atomic Database Operations:** For critical operations that involve multiple database updates, such as aborting a mission (which changes both the `Mission` and `Drone` status), I used `prisma.$transaction`. This guarantees that the operations are atomic—either they all complete successfully, or they all fail, preventing the database from ever entering an inconsistent state.

* **Strategy for Adaptability:**
    * **Component-Based Architecture:** The application is broken down into reusable React components, making it easy to maintain, update, or replace parts of the UI without affecting the rest of the application.
    * **Schema-Driven Development:** Prisma serves as a single source of truth for the data model. To adapt the application to new requirements, a developer only needs to update the `schema.prisma` file. Running `prisma generate` automatically updates all data types across the application, making it highly adaptable.
    * **Serverless and Scalable Foundation:** The choice of Next.js and Vercel provides a serverless architecture that is inherently scalable. The application can handle fluctuations in traffic without manual intervention, making the system adaptable to future growth.


