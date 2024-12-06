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
- [ ] **1. Define a Good Implementation** 
  - [ ] Read the documentation (guidelines, best practices...)
  - [ ] Brainstorm how to implement this check.
  - [ ] Achieve an agreement on the implementation details before starting to work on this.
- [ ] **2. Update Check Record**
  - [ ] Update the `compliance_checks` row with the following fields: `how_to_url`, `implementation_status`, `implementation_type` and `implementation_details_reference`
  - [ ] Check the migration scripts using `npm run db:migrate` and `npm run db:rollback`
  - [ ] Update the database schema by running `npm run db:generate-schema`
- [ ] **3. Implement the Business Logic**
  - [ ] Add the alert row in the `compliance_checks_alerts` table.
  - [ ] Add the task row in the `compliance_checks_tasks` table.
  - [ ] Add the result row in the `compliance_checks_results` table.
- [ ] **4. Ensure It Works as Expected**
  - [ ] Add new unit tests for this check.
  - [ ] Add new e2e test cases for this check.
  - [ ] Verify that all tests are passing.
  - [ ] Run the command `check run --name {check_code_name}` and verify the changes in the database. Update the seed script if needed (`npm run db:seed`)