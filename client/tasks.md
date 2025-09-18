1. **Remove API Calls**:  
   Remove the following endpoints from the `/api` route:

   - Authentication endpoints (`/signin`, `/signup`, `/forgot-password`, `/change-password`).
   - Vendor management endpoints (`/vendor/list`, `/vendor/create`, `/vendor/update`).
   - Product-related endpoints (`/product/create`, `/product/list`, `/product/buy`).

2. **Mock Data**:  
   For each page, replace dynamic API data with hardcoded mock data. For example:

   - **Products Page**:  
     Replace the API response with a list of products like this:
     ```javascript
     const products = [
       {
         id: 1,
         name: "Product 1",
         price: 100,
         description: "Product 1 description",
         imageUrl: "path/to/image",
       },
       {
         id: 2,
         name: "Product 2",
         price: 200,
         description: "Product 2 description",
         imageUrl: "path/to/image",
       },
       // Add more products as necessary
     ];
     ```
   - **Vendor Page**:  
     Use hardcoded vendor details:
     ```javascript
     const vendor = {
       id: 1,
       name: "Vendor 1",
       description: "This is vendor 1",
       products: products,
     };
     ```
   - **Customer Dashboard**:  
     Hardcode customer data, e.g., `test@gmail.com` for testing:
     ```javascript
     const customer = { email: "test@gmail.com", name: "Test User" };
     ```

3. **Remove Authentication Logic**:

   - **Login/SignUp**: Replace the login functionality with a dummy check.
     For example:
     ```javascript
     const user = { email: "test@gmail.com", password: "password" };
     const login = (email, password) => {
       if (email === user.email && password === user.password) {
         // Proceed with user dashboard
       }
     };
     ```
   - **Remove Clerk or Any Authentication Logic**: Delete any references to Clerk, Firebase, or other authentication services.

4. **Clean Up Routes**:

   - Ensure the front-end routes do not rely on real API data. All data should be either static or mock data for testing purposes.
   - Example:
     - In the `routes.js` or `App.js`, make sure the routes for `/login`, `/signup`, `/dashboard` are hardcoded and have dummy data.

5. **UI Components**:

   - For all pages (login, signup, vendor dashboard, product listing, etc.), display the hardcoded data.
   - Ensure all UI components are working and displaying mock data correctly.

6. **Testing**:
   - Test the frontend by ensuring the app functions with dummy data (you can manually enter data like `test@gmail.com` to simulate login).
   - Verify that no API calls are being made (or that any leftover ones are replaced with static data).

### Final Structure

Once completed, your frontend should have the following structure:

- **Authentication Pages**: Login and Signup using hardcoded dummy data.
- **Product Pages**: Display product details using mock data.
- **Vendor Pages**: Vendor list and profile management using mock data.
- **Dashboard**: Show user/vendor data using dummy values like `test@gmail.com`.

### PHASE 2:

Create the Authentication System:

- Login Page: Design and implement the login page.
- Register Page: Design and implement the registration page.
- Forgot Password Page: Design and implement the forgot password page.
- Verification E-mail Page: Design and implement the verification e-mail page.
- Use Dummy Data: Populate all pages with dummy data for now.
- Completion: Once done, let me know so I can pull the code.