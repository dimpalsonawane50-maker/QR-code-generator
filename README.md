Lab QR Code Generator

Project Overview

This project is a QR Code Generator for displaying information about different labs. By selecting a lab from the dropdown, users can generate a QR code containing details about that lab. When scanned with a mobile device, the QR code displays textual information such as the lab's location, contact info, and description.

Features

Dropdown for lab selection: Choose from 7 different labs.

QR code generation: Once a lab is selected, click "Generate QR Code" to create a QR code with lab details.

Responsive Design: The layout adjusts for both mobile and desktop views.

Lab Images: Each lab has an associated image that is displayed below the QR code.

Easy Setup: No complex backend required — just static HTML, CSS, and JavaScript.



---

Technologies Used

HTML5: Structure of the web pages.

CSS3: Styling and layout for a responsive, modern interface.

JavaScript: Functionality for QR code generation and interactivity.

QRCode.js Library: A JavaScript library to generate QR codes.



---

Prerequisites

Before running the project, make sure you have the following:

1. Web browser: Any modern browser (e.g., Chrome, Firefox, Safari).


2. Images: Place the images of the labs in the images/ folder (or update the paths if the images are located elsewhere).




---

Setup Instructions

Step 1: Clone the Repository

If you haven’t already, clone the repository to your local machine using the following command:

git clone https://github.com/yourusername/lab-qr-generator.git

Alternatively, download the project as a ZIP file from GitHub and extract it to your desired directory.

Step 2: Install Dependencies

No dependencies are required for this project, as it uses only static files (HTML, CSS, and JavaScript). The QRCode.js library is loaded via CDN.

Step 3: Add Lab Images

Ensure you have images corresponding to each lab in the images/ folder. Here are the recommended filenames:

computer_lab.jpg

electronics_lab.jpg

physics_lab.jpg

chemistry_lab.jpg

mechanical_lab.jpg

networking_lab.jpg

ai_lab.jpg


You can also update the image paths in the script.js file if your images are stored in a different location.

Step 4: Open in Browser

After setting up, simply open the index.html file in any modern web browser to see the project in action.


---

How to Use

1. Select a Lab: From the dropdown, choose a lab you want to generate the QR code for.


2. Generate the QR Code: Click the "Generate QR Code" button to generate the QR code.


3. Scan the QR Code: Use your mobile device to scan the QR code. It will display the lab’s textual information, such as location, contact details, and description.


4. See the Lab Image: Below the QR code, the image of the selected lab will be displayed.




---

Project Structure

Here’s the structure of the project:

lab-qr-project/
│
├── index.html        # Main HTML file for the QR Code Generator page
├── style.css         # CSS file for styling the page
├── script.js         # JavaScript to handle QR generation and interactivity
├── README.md         # This README file
├── images/           # Folder containing the lab images (computer_lab.jpg, etc.)
└── qrcode.min.js     # QRCode.js library (loaded via CDN)


---

Contributions

Feel free to fork this repository and contribute to improving the project! To contribute:

1. Fork the repository.


2. Create a new branch.


3. Make your changes.


4. Submit a pull request with a description of your changes.
5.
