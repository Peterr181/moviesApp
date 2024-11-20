
# Movies App

Technologies:
React Native, TypeScript, Express.js, MongoDB


## Features Implemented

This project simulates a video rental system using a NoSQL database. It offers functionality for managing films, customers, and rentals with an administrative interface for managing the operations. Below is a breakdown of the features implemented in the application:

### 1. **Film Management**
- **Display List of Available Films**: Shows a list of all available films for rent, including details such as title, genre, director, runtime, and rating (1-10). Additionally, detailed information like description and cast can be viewed. 
  - Films that are already rented are either hidden or marked as unavailable.
  - Sorting and filtering by title or genre is supported.

- **Add New Film**: Allows the administrator to add new films to the rental collection.

- **Modify Film Description**: The administrator can modify any film's details, including title, description, genre, and other information.

- **Remove Film**: Films that are not currently rented can be removed from the database. Films that are currently rented cannot be deleted.

### 2. **Customer Management**
- **Add New Customer**: Administrators can register new customers to the system by providing their name, address, phone number, and registration date.

- **Modify Customer Data**: A list of all customers is displayed, and the administrator can modify any customer's data (name, address, phone number, etc.).

- **Remove Customer**: Administrators can delete a customer, provided they do not have any active rentals. Customers with active rentals cannot be removed.

### 3. **Rental Management**
- **Display Rental History**: The administrator can view a list of all rentals made by customers, including details such as customer information, film title, rental date, planned return date, and actual return date.
  - Sorting by customer data, rental date, or film title is supported.
  - Customers can also return rented films, updating the actual return date.

- **Rent Film**: When a customer requests a rental, the administrator checks if the film is available and if the customer has not exceeded the maximum rental limit (3 films at once). The system records the rental, including the rental date and planned return date (2 days after the rental).

### 4. **User Registration and Access**
- **User Registration**: New users can register to the system to become customers, where they can view available films, their personal rental history, and rent films.

- **Admin Access**: The administrator has special privileges to manage customers, films, and rentals. Only the administrator can process film returns and manage film and customer data.

### 5. **Error Handling**
- The system includes error handling for common issues such as:
  - Attempting to add a film that already exists in the database.
  - Preventing the deletion of films that are currently rented.
  - Ensuring a customer cannot be deleted if they have active rentals.
  - Other validation checks to ensure data consistency and prevent improper operations.


