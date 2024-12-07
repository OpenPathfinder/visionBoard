---
name: Add a new compliance check
about: Use it when you want to work in a new compliance check
title: 'Add Compliance check:'
labels: compliance-checks
assignees: UlisesGascon

---

### How the Check Works

_Provide a clear definition_


### Pending Tasks

You can find more details in [the contributing guide](/CONTRIBUTING.md#current-initiatives)

- [ ] **1. Define a Good Implementation [Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/43#issuecomment-2524594504)** 
  - [ ] Read the documentation (guidelines, best practices...)
  - [ ] Brainstorm how to implement this check (logic, alerts, tasks, validations, edge cases...).
  - [ ] Achieve an agreement on the implementation details before starting to work on this.
- [ ] **2. Update Check Record [Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/commit/55eaac59920a5229ef9eeaf859943578a66d1aeb)**
  - [ ] Update the `compliance_checks` row with the following fields: `how_to_url`, `implementation_status`, `implementation_type` and `implementation_details_reference`
  - [ ] Check the migration scripts using `npm run db:migrate` and `npm run db:rollback`
  - [ ] Update the database schema by running `npm run db:generate-schema`
- [ ] **3. Implement the Business Logic [Validator Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/commit/44c41d119f0daefb7b2e496ba35d5ab65bcc319b) and [Check Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/commit/6f1e16129ee0d01a1b9b536cd2dc6090b048b71f)**
  - [ ] Add the specific validator in `src/checks/validators/index.js`
  - [ ] Add the check logic in `src/checks/complianceChecks`
  - [ ] Ensure that the check is in scope for the organization (use `isCheckApplicableToProjectCategory`)
  - [ ] Ensure that the `severity` value is well calculated (use `getSeverityFromPriorityGroup`)
  - [ ] Add the alert row in the `compliance_checks_alerts` table when is needed.
  - [ ] Add the task row in the `compliance_checks_tasks` table when is needed.
  - [ ] Add the result row in the `compliance_checks_results` table.
- [ ] **4. Ensure It Works as Expected**
  - [ ] Add new unit tests for the validator check.
  - [ ] Add new integration test cases for this check.
  - [ ] Verify that all tests are passing.
  - [ ] Run the command `check run --name {check_code_name}` and verify the changes in the database. Update the seed script if needed (`npm run db:seed`)
- [ ] **5. Update the website [Example](https://github.com/secure-dashboards/openjs-security-program-standards/pull/9)**
  - [ ] Review the current content it in `https://openjs-security-program-standards.netlify.app/details/{check_code_name}`
  - [ ] Create a PR in https://github.com/secure-dashboards/openjs-security-program-standards to include how we calculate this check and include additional information on the mitigation if needed.
