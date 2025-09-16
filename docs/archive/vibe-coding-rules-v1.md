# Vibe Coding Rules & Standards

## Core Philosophy
**Stay in control of your codebase and design decisions through disciplined documentation and versioning.**

**Guiding Principles:**
1. **Delete, delete, delete** → The best feature is no feature. Ask "What happens if we don't build this at all?"
2. **Keep it as simple as possible** → Straightforward over clever. Readable beats short.
3. **Build only when needed** → Do not add features on speculation.
4. **Write for humans first** → Clever code is bad code.
5. **The five-minute rule** → If you cannot explain it quickly, it is too complex.

---

## Rule 1: Vibe Coding Logs (Mandatory)

### What: Maintain a coding log for every project
- **Location**: `/docs/vibe-log.md` in project root
- **Update frequency**: After every major change or coding session
- **Format**: Date + Time, change summary, reasoning, impact
- **Timestamp Format**: `YYYY-MM-DD HH:MM` (24-hour format)

### Template:
```markdown
## 2025-09-15 14:30 - Database Decision
**Change**: Switched from Airtable to Firestore
**Why**: Custom forms needed, API rate limits, real-time requirements
**Impact**: Need to rebuild admin dashboard, better performance expected
**Files affected**: /src/database/, /docs/design-doc-v2.md
```

### Examples of "Major Changes":
- Architecture decisions (database, framework, hosting)
- API integrations or removals
- UI/UX design system updates
- Security or authentication changes
- Performance optimizations
- Third-party service additions/removals

---

## Rule 2: Documentation Structure (Mandatory)

### Project-Level Documentation (Outside App Folders)
- **Location**: `/docs/` in project root
- **Purpose**: System-wide documentation that applies to multiple apps
- **Contents**:
  - `design-doc-v*.md` - System architecture and design decisions
  - `vibe-coding-rules.md` - Development standards and philosophy
  - `vibe-log.md` - Project development history
  - `agent-discussions.md` - AI conversation log

### App-Level Documentation (Inside App Folders)
- **Location**: `/docs/` within each app folder
- **Purpose**: App-specific documentation and development logs
- **Contents**:
  - `vibe-log.md` - App-specific development history
  - `agent-discussions.md` - App-specific AI conversations
  - `README.md` - App setup and usage instructions

### Why This Structure?
1. **Separation of concerns** - Project docs vs app docs
2. **Multiple apps** - admin.flyjetr.com and flyjetr.com as separate apps
3. **Clean organization** - Easy to find relevant documentation
4. **Scalability** - Works as the project grows

---

## Rule 3: Design Doc Versioning (Mandatory)

### Version every design document update
- **Naming**: `design-doc-v1.md`, `design-doc-v2.md`, etc.
- **When to version**: Any significant architectural or feature changes
- **Keep old versions**: Never delete, maintain history

### Version Triggers:
- Database/tech stack changes
- New major features added
- Workflow changes
- Integration updates
- Security model changes

### Version Log Format:
```markdown
# Design Doc History

## v3.0 - 2025-09-15 16:45
- Switched to Firestore database
- Added custom form requirements
- Updated interface specifications

## v2.0 - 2025-09-10 11:20
- Added vendor management system
- Expanded passenger profile requirements

## v1.0 - 2025-09-05 09:00
- Initial design document
- Basic trip management workflow
```

---

## Rule 3: Decision Documentation

### Document the "why" behind every major decision
- **Tech choices**: Why Firebase over AWS? Why React over Vue?
- **Design patterns**: Why this folder structure? Why this naming convention?
- **Integrations**: Why this payment processor? Why this API?

### Format:
```markdown
## Decision: [Title] - 2025-09-15 14:30
**Context**: What problem were we solving?
**Options**: What did we consider?
**Decision**: What did we choose and why?
**Consequences**: What are the trade-offs?
```

---

## Rule 4: Code Organization Standards

### Cursor Rules Setup
Create `.cursor/rules/` directory with:
- `core.txt` - Fundamental development philosophy  
- `firebase-rules.txt` - Firestore patterns, Firebase best practices
- `react-rules.txt` - Component standards, form patterns

### Folder Structure (Consistent across projects)

#### Project-Level Structure
```
/Users/seanx/code/flyjetr 2.0/
├── docs/                          # Project documentation (OUTSIDE app folders)
│   ├── design-doc-v1.md          # System design documents
│   ├── vibe-coding-rules.md      # This file
│   ├── vibe-log.md               # Project development log
│   └── agent-discussions.md      # AI conversation log
├── flyjetr-app/                  # Main React app (flyjetr.com)
│   ├── src/
│   ├── docs/                     # App-specific docs
│   │   ├── vibe-log.md
│   │   └── agent-discussions.md
│   └── README.md
├── admin-app/                    # Future admin app (admin.flyjetr.com)
└── shared/                       # Shared utilities, types, etc.
```

#### App-Level Structure (within each app folder)
```
.cursor/rules/
  ├── core.txt
  ├── firebase-rules.txt  
  └── react-rules.txt
/src
  ├── components/
  ├── pages/
  ├── utils/
  └── config/
/tests
README.md
```

### File Naming & Code Standards
- **Components**: PascalCase (`TripCreationForm.jsx`)
- **Utilities**: camelCase (`formatDate.js`)
- **Pages**: PascalCase (`Dashboard.jsx`)
- **Config**: lowercase (`firebase.config.js`)

### Code Quality Standards
- **Max file size**: 500 lines (refactor if larger)
- **Max function size**: 50 lines (break down if larger)
- **Max nesting levels**: 3 (prefer early returns)
- **Function naming**: Descriptive over short (`calculateTripCost()` not `calc()`)
- **Comments for multi-step flows**:
  ```javascript
  // 1️⃣ Validate passenger data ----
  // 2️⃣ Save to Firestore ----  
  // 3️⃣ Send confirmation email ----
  ```

---

## Rule 5: Commit Standards

### Meaningful commit messages
```
feat: add passenger profile form
fix: resolve Firebase auth redirect
docs: update design doc to v2
refactor: simplify trip creation workflow
```

### Commit frequency
- Commit working code daily minimum
- Don't commit broken builds
- Include relevant files in each commit

---

## Rule 6: Dependency Management

### Don't reinvent what already exists
- Choose proven libraries over custom solutions
- Prefer boring, stable tech over cutting edge
- **Why added**: What problem does it solve?
- **Alternatives considered**: What else was evaluated?
- **Risk assessment**: Vendor lock-in, maintenance, security

### Examples for your stack:
- ✅ Firebase (proven, Google-backed)
- ✅ React Hook Form (battle-tested forms)
- ✅ Tailwind CSS (utility-first, stable)
- ❌ Custom auth system (use Firebase Auth)
- ❌ Custom database ORM (use Firebase SDK)

### Regular audits
- Monthly dependency review
- Update security patches immediately
- Remove unused dependencies

---

## Rule 7: Error Handling Philosophy

### Fail fast and simple
- Validate only uncertain inputs (user data, API responses, file uploads)
- Don't over-validate internal code you control
- Log errors with context, not just stack traces
- Use meaningful error messages for users

### Examples:
```javascript
// ✅ Good - validate user input, clear naming, single responsibility
const validatePassengerData = (passengerForm) => {
  if (!passengerForm.name?.trim()) {
    throw new Error('Passenger name is required');
  }
  if (!passengerForm.email?.includes('@')) {
    throw new Error('Valid email address required');
  }
};

// ❌ Bad - over-validating internal code, cryptic naming
const validate = (data) => {
  if (!data) throw new Error('Data required'); // Unnecessary validation
  // ... complex validation logic
};
```

### The "Understandable in 30 Seconds" Rule
- If code takes longer than 30 seconds to understand, rewrite it
- Use whitespace between logical groups
- Prefer verbose, clear code over terse, cryptic code

---

## Rule 8: Testing Philosophy

### Test what matters
- Critical user flows (trip creation, payment processing)
- Data validation (passenger info, flight details)
- Integration points (Firebase, payment APIs)

### Don't over-test
- Skip unit tests for simple utilities
- Focus on integration and E2E tests
- Test user experience, not implementation details

---

## Rule 9: Performance Monitoring

### Establish baselines
- Page load times
- API response times
- Database query performance
- User action completion rates

### Track in vibe log
```markdown
## 2025-09-15 15:30 - Performance Baseline
**Forms**: Average 300ms load time
**Dashboard**: 1.2s initial load
**File upload**: 2s average for passport images
```

---

## Rule 10: Security Standards

### Never commit secrets
- Use environment variables
- Document required env vars in README
- Use `.gitignore` properly

### Regular security reviews
- Monthly credential rotation
- Dependency vulnerability scans
- Access control audits

---

## Rule 11: Agent Discussions & Learning Log

### What: Document every meaningful conversation with coding agents
- **Location**: `/docs/agent-discussions.md` in project root
- **Update frequency**: After any technical discussion or recommendation request
- **Purpose**: Capture learning, avoid asking the same questions twice

### Template:
```markdown
## 2025-09-15 14:30 - Database Selection Discussion

**Context**: Choosing between Airtable vs Firestore for custom forms
**Agent**: Claude Sonnet 4
**Duration**: ~20 minutes
**Timestamp**: 2025-09-15 14:30 - 14:50

### Question Asked:
"Should I use Firestore or Airtable for my jet charter management system with custom React forms?"

### Key Recommendations:
1. **Firestore over Airtable** - Better for custom interfaces
2. **API rate limits** - Airtable's 5 req/sec would throttle forms
3. **Real-time updates** - Firestore provides instant sync
4. **Firebase ecosystem** - Aligns with Google-only stack

### Decision Made:
Switched to Firestore as primary database

### Learning/Insights:
- Airtable is great for ops teams but terrible for custom apps
- Always consider rate limits when building user-facing interfaces
- Firebase Admin SDK gives server-side superpowers for ops team

### Files Updated:
- `design-doc-v2.md` - Updated database architecture
- `vibe-log.md` - Added database switch reasoning

### Follow-up Questions to Explore:
- How to structure Firestore collections for complex relationships?
- Best practices for Firebase Security Rules?
```

### Discussion Categories:
- **Architecture decisions** - Database, hosting, framework choices
- **Technical patterns** - How to structure code, components, data
- **Tool evaluations** - Library comparisons, service selections
- **Problem solving** - Debugging approaches, optimization strategies
- **Best practices** - Coding standards, security, performance

### Benefits of Agent Discussion Logs:
1. **Avoid repeated questions** - Check if you've already discussed this topic
2. **Track decision reasoning** - Remember why you chose one approach over another
3. **Build personal knowledge base** - Accumulate learning over time
4. **Pattern recognition** - Identify recurring themes in your technical decisions
5. **Agent context** - Help future conversations by referencing past discussions

### Integration with Other Rules:
- Cross-reference with **Vibe Log** for implementation details
- Link to **Design Doc versions** when architecture changes
- Update **Decision Documentation** with agent recommendations

---

## Rule 12: Backup & Recovery

### Multiple backup strategies
- **Code**: Git + GitHub/GitLab
- **Database**: Automated backups enabled
- **Files**: Cloud storage with versioning
- **Docs**: Version controlled with code

### Recovery testing
- Quarterly backup restoration tests
- Document recovery procedures
- Test disaster recovery scenarios

---

## Implementation Checklist

### Every New Project:
- [ ] Create `/docs/vibe-log.md`
- [ ] Create `/docs/agent-discussions.md`
- [ ] Create initial `design-doc-v1.md`
- [ ] Set up proper folder structure
- [ ] Configure `.gitignore`
- [ ] Document tech stack decisions
- [ ] Set up automated backups

### Every Major Change:
- [ ] Update vibe log with reasoning
- [ ] Log agent discussions that led to decisions
- [ ] Version design doc if architecture changes
- [ ] Update README if setup changes
- [ ] Commit with descriptive message
- [ ] Consider impact on existing features

### Weekly Reviews:
- [ ] Review vibe log for patterns
- [ ] Check for unused dependencies
- [ ] Verify backup systems working
- [ ] Update documentation if needed

---

## Benefits

**For You:**
- Never forget why you made a decision
- Easy to onboard new team members
- Quick context switching between projects
- Historical record of what works/doesn't work

**For The Business:**
- Faster debugging and troubleshooting
- Easier handoffs and collaboration
- Reduced technical debt
- Better decision-making with historical context

**Remember**: These rules exist to help you code with confidence and maintain control over your projects. Adapt them as needed, but always document why.



###
Note: alot of the time timestamps have been incorrect using 1/27 as the date

and the design updates doc is being updated incorrected focsuing more on css stylgin and achanges of color i didnt even watn

I really want a log of when im like no the form should contain xyz.. in this cfomat wtc

any thign that I dont say on the actual design doc should go here

also the design doc should never be updated here

