<?php
// Define file paths for saving data
$csvFile = 'data.csv';
$jsonFile = 'data.json';

// Initialize variables
$name = '';
$email = '';
$phone = '';
$course = '';
$message = '';
$errors = [];
$successMsg = '';

// Check if form is submitted via POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Sanitization: clean user inputs
    $name = trim(htmlspecialchars(stripslashes($_POST['name'] ?? '')));
    $email = trim(htmlspecialchars(stripslashes($_POST['email'] ?? '')));
    $phone = trim(htmlspecialchars(stripslashes($_POST['phone'] ?? '')));
    $course = trim(htmlspecialchars(stripslashes($_POST['course'] ?? '')));
    $message = trim(htmlspecialchars(stripslashes($_POST['message'] ?? '')));

    // 2. Validation: check empty & invalid fields
    if (empty($name)) {
        $errors[] = "Name is required.";
    } elseif (!preg_match("/^[a-zA-Z\s]+$/", $name)) {
        $errors[] = "Name must only contain letters and spaces.";
    }

    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }

    if (empty($phone)) {
        $errors[] = "Phone number is required.";
    } elseif (!preg_match("/^[0-9]{10}$/", $phone)) {
        $errors[] = "Phone number must be exactly 10 digits.";
    }

    if (empty($course)) {
        $errors[] = "Please select a course.";
    }

    // 3. If no validation errors, store data to CSV and JSON
    if (empty($errors)) {
        $timestamp = date("Y-m-d H:i:s");

        // --- Store in CSV ---
        $csvHeaderNeeded = !file_exists($csvFile) || filesize($csvFile) == 0;
        $fp = fopen($csvFile, 'a');
        if ($csvHeaderNeeded) {
            fputcsv($fp, ['Timestamp', 'Name', 'Email', 'Phone', 'Course', 'Message']);
        }
        fputcsv($fp, [$timestamp, $name, $email, $phone, $course, $message]);
        fclose($fp);

        // --- Store in JSON ---
        $newRecord = [
            'timestamp' => $timestamp,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'course' => $course,
            'message' => $message
        ];

        $jsonData = [];
        if (file_exists($jsonFile) && filesize($jsonFile) > 0) {
            $existing = json_decode(file_get_contents($jsonFile), true);
            if (is_array($existing)) {
                $jsonData = $existing;
            }
        }
        $jsonData[] = $newRecord;
        file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));

        // Set success message
        $successMsg = "Registration submitted successfully and stored in CSV & JSON!";

        // Clear fields after success
        $name = $email = $phone = $course = $message = '';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Practical 7 - Student Registration Form</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f9;
            margin: 30px auto;
            max-width: 700px;
            padding: 0 15px;
        }
        .form-box {
            background: #ffffff;
            border-radius: 8px;
            padding: 25px 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
            margin-top: 0;
            color: #333333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 8px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #444444;
        }
        input[type="text"],
        input[type="email"],
        select,
        textarea {
            width: 100%;
            padding: 9px 10px;
            border: 1px solid #cccccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        input:focus, select:focus, textarea:focus {
            border-color: #007bff;
            outline: none;
        }
        .btn-submit {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .btn-submit:hover {
            background-color: #0056b3;
        }
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            padding: 12px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            padding: 12px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .alert-error ul {
            margin: 5px 0 0 20px;
            padding: 0;
        }
        /* Stored Data Table */
        .stored-data {
            margin-top: 30px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
        }
        th, td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

    <div class="form-box">
        <div style="margin-bottom:12px;"><a href="../index.html" style="color:#007bff; text-decoration:none; font-size:14px; font-weight:bold;">← Return to StudentHub Campus Portal</a></div>
        <h2>Student Registration Form</h2>

        <!-- Success Message -->
        <?php if (!empty($successMsg)): ?>
            <div class="alert-success">
                <strong>Success:</strong> <?php echo $successMsg; ?>
            </div>
        <?php endif; ?>

        <!-- Error Message -->
        <?php if (!empty($errors)): ?>
            <div class="alert-error">
                <strong>Please fix the following errors:</strong>
                <ul>
                    <?php foreach ($errors as $err): ?>
                        <li><?php echo $err; ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <!-- Form with method="POST" -->
        <form method="POST" action="">
            <div class="form-group">
                <label for="name">Full Name *</label>
                <input type="text" id="name" name="name" value="<?php echo $name; ?>" placeholder="Enter your full name">
            </div>

            <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" value="<?php echo $email; ?>" placeholder="Enter your email">
            </div>

            <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input type="text" id="phone" name="phone" value="<?php echo $phone; ?>" placeholder="10-digit phone number">
            </div>

            <div class="form-group">
                <label for="course">Course *</label>
                <select id="course" name="course">
                    <option value="">-- Select Course --</option>
                    <option value="Computer Science" <?php if ($course == 'Computer Science') echo 'selected'; ?>>Computer Science</option>
                    <option value="Information Technology" <?php if ($course == 'Information Technology') echo 'selected'; ?>>Information Technology</option>
                    <option value="Mechanical" <?php if ($course == 'Mechanical') echo 'selected'; ?>>Mechanical</option>
                    <option value="Civil" <?php if ($course == 'Civil') echo 'selected'; ?>>Civil</option>
                </select>
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="3" placeholder="Enter message or remarks"><?php echo $message; ?></textarea>
            </div>

            <button type="submit" class="btn-submit">Submit Form</button>
        </form>
    </div>

    <!-- Display Stored CSV Data for Easy Screenshot -->
    <div class="stored-data">
        <h3>Stored Data (from data.csv)</h3>
        <?php if (file_exists($csvFile) && filesize($csvFile) > 0): ?>
            <table>
                <?php
                $handle = fopen($csvFile, "r");
                $isFirst = true;
                while (($data = fgetcsv($handle)) !== FALSE) {
                    echo "<tr>";
                    foreach ($data as $col) {
                        if ($isFirst) {
                            echo "<th>" . htmlspecialchars($col) . "</th>";
                        } else {
                            echo "<td>" . htmlspecialchars($col) . "</td>";
                        }
                    }
                    echo "</tr>";
                    $isFirst = false;
                }
                fclose($handle);
                ?>
            </table>
        <?php else: ?>
            <p>No records stored yet.</p>
        <?php endif; ?>
    </div>

</body>
</html>
