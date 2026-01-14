
# Folowup Backend API – React Native Integration Guide

**API Base URL (Local Development):** `http://localhost:8000/api`
**API Base URL (Production):** `https://your-domain.com/api`

---

## API Endpoints Overview

All endpoints are prefixed with `/api`. Authentication is via Bearer token (Laravel Sanctum). See below for all available endpoints, request/response formats, and filtering options.

### Authentication

#### POST `/auth/google`
- Login/register with Google OAuth (`id_token` required)
- Response: `{ token, user }`
- Errors: 401 (invalid token), 500 (server error)

#### POST `/auth/login`
- Login with email/password (must have set password via Google first)
- Response: `{ token, user }`
- Errors: 401 (invalid credentials or no password set)

#### POST `/auth/set-password` (auth required)
- Set password for Google user
- Body: `{ password, password_confirmation }` (min 8 chars, confirmed)
- Response: `{ message }`
- Errors: 401 (not authenticated), 422 (validation)

#### GET `/me` (auth required)
- Get current user profile
- Response: user object
- Errors: 401 (invalid/missing token)

### Leads

#### GET `/leads` (auth required)
  - `workspace_id` (int, optional)
  - `lead_type` (string, optional)
  - `min_amount` (float, optional)
  - `max_amount` (float, optional)
  - `page` (int, default 1)
  - `per_page` (int, default 20, max 100)
  - `sort_by` (string, default `created_at`)
  - `sort_order` (`asc`|`desc`, default `desc`)
  ```json
  {
    "data": [
      {
        "id": 1,
        "workspace_id": 1,
        "owner_id": 1,
        "name": "Alice Johnson",
        "phone": "+1234567890",
        "lead_type": "home_loan",
        "deal_value": 5000000,
        "meta": { "source": "Facebook Ads" },
        "created_at": "2026-01-06T16:50:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 20,
      "total": 1,
      "last_page": 1
    }
  }
  ```

#### POST `/leads` (auth required)
  - `name` (string, required)
  - `phone` (string, required)
  - `workspace_id` (int, optional)
  - `lead_type` (string, optional)
  - `deal_value` (float, optional)
  - `meta` (object, optional)

### Workspaces

#### GET `/workspaces` (auth required)
- List all workspaces for the authenticated user
- Response: Array of workspace objects
- Errors: 401 (unauthenticated)

#### POST `/workspaces` (auth required)
- Create a new workspace
- Body: `{ name }`
- Response: Workspace object
- Errors: 401 (unauthenticated), 422 (validation)

#### GET `/workspaces/{workspace}/members` (auth required)
- List all members of a workspace
- Response: Array of user objects
- Errors: 401 (unauthenticated), 404 (not found)

#### POST `/workspaces/{workspace}/invite` (auth required)
- Invite a user to a workspace
- Body: `{ email, role }`
- Response: Invitation object
- Errors: 401 (unauthenticated), 422 (validation)

### Workspace Invitations

#### GET `/workspace-invitations` (auth required)
- List all workspace invitations for the authenticated user
- Response: Array of invitation objects
- Errors: 401 (unauthenticated)

#### POST `/workspace-invitations/{invite}/accept` (auth required)
- Accept a workspace invitation
- Response: Success message
- Errors: 401 (unauthenticated), 404 (not found)

#### POST `/workspace-invitations/{invite}/reject` (auth required)
- Reject a workspace invitation
- Response: Success message
- Errors: 401 (unauthenticated), 404 (not found)

#### DELETE `/workspaces/{workspace}/users/{user}` (auth required)
- Remove a user from a workspace
- Response: Success message
- Errors: 401 (unauthenticated), 404 (not found)
---

## Request/Response Examples

### Auth Flow (Google Login)
```javascript
const response = await fetch('http://localhost:8000/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id_token })
});
const { token, user } = await response.json();
```

### Create a Lead
```javascript
const response = await fetch('http://localhost:8000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ name, phone, lead_type, deal_value, meta })
});
const data = await response.json();
```

### List Leads with Filters
```javascript
const params = new URLSearchParams({ lead_type: 'home_loan', min_amount: 1000000 });
const response = await fetch(`http://localhost:8000/api/leads?${params}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const leads = await response.json();
```

---

## Error Handling

All errors return JSON:
```json
{
  "message": "Error description",
  "errors": { "field": ["Validation error"] }
}
```
Common status codes: 200 (OK), 201 (Created), 401 (Unauthorized), 422 (Validation), 500 (Server error)

---

## React Native Integration Tips

- Use AsyncStorage or Keychain for token storage
- Always set `Authorization: Bearer <token>` for protected endpoints
- Handle 401 errors by logging out user
- See `src/services/api.ts` for a full API wrapper example

---

## Quick Setup Checklist

- [ ] Install axios or fetch
- [ ] Set up API service wrapper
- [ ] Integrate Google Sign-In
- [ ] Implement token storage
- [ ] Build login, leads list, and create lead screens
- [ ] Handle token expiration
- [ ] Test endpoints in staging
- [ ] Update API base URL for production

---

## Support & Debugging

- Test `/api` endpoint for server status
- Check CORS if requests fail from web
- Clear token and re-login if auth fails
- Use `docker compose logs` for backend issues

